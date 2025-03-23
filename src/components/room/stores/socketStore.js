import { defineStore } from 'pinia'

// Clase auxiliar para formatear mensajes salientes
class Event {
  constructor(action, payload) {
    this.action = action
    this.payload = payload
  }
}


export const useWebSocketStore = defineStore('webSocketStore', {
  state: () => ({
    // Instancia de WebSocket
    socket: null,
    socketUrl: null,
    // Estado de conexión
    connected: false,
    reconnecting: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5,
    reconnectBaseDelay: 1000,
    username: '',
    room: null,
    roomId: null,

    userList: [],
    messages: [],

    voting: false,
    currentProposal: null,
    resultsAvailable: false, //indica que el tiempo para votar ha terminado, solo lo recibe el admin
    resultsReady: false, //indica que los resultados están listos para ser mostrados
    results: [],

    countdown: 0,
    timer: null,
  }),
  getters: {
    voteCounts: (state) => {
      return state.results.reduce((acc, vote) => {
        // Cuenta cuántas veces se repite cada option_id
        acc[vote.option_id] = (acc[vote.option_id] || 0) + 1;
        return acc;
      }, {});
    },
  },

  actions: {
    connect(url) {

      if (this.socket !== null) {
        console.warn('Ya estás conectado al WebSocket.');
        return;
      }
      this.socketUrl = url;
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        this.connected = true;
        this.reconnecting = false;
        this.reconnectAttempts = 0;
        this.pushMessage('Conexión abierta.');
      };

      this.socket.onmessage = (event) => {
        const eventData = JSON.parse(event.data);
        this.receiveEvents(eventData);
      };

      this.socket.onclose = (event) => {
        this.connected = false;
        this.socket = null;
        if (event.code === 4001) {
          this.pushMessage('La sala no existe. No se reintentará la conexión.');
          return;
        }
        this.pushMessage('Conexión cerrada.');
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.attemptReconnect();
        } else {
          this.pushMessage('Se alcanzó el número máximo de intentos de reconexión.');
        }
      };

      this.socket.onerror = (error) => {
        this.connected = false;
        console.error('WebSocket Error:', error);
        this.pushMessage('Error en la conexión WebSocket.');
      };

      this.socket.sendEvents = (eventName, payload) => {
        const evt = new Event(eventName, payload);
        this.socket.send(JSON.stringify(evt));
      };
    },

    pushMessage(msg) {
      this.messages.push(msg);
    },

    updateClientList(payload) {
      const data = typeof payload === 'string' ? JSON.parse(payload) : payload
      this.userList = data.clients || []
    },

    close() {
      this.connected = false;
      if (this.socket === null) {
        console.warn('No estás conectado al WebSocket.');
        return;
      }

      this.socket.close();
      this.socket = null;
    },


    receiveEvents(eventData) {
      if (!eventData.action) {
        alert("Evento no definido");
        return;
      }

      switch (eventData.action) {
        case "send_message":
          this.pushMessage(`${eventData.payload.from} : ${eventData.payload.message}`);
          break;
        case "update_client_list":
          this.updateClientList(eventData.payload);
          break;
        case "first_proposal":
          console.log(eventData);
          this.voting = true
          this.currentProposal = eventData.payload;
          break;
        case "results":
          this.resultsReady = true;
          console.log(eventData);
          this.results = eventData.payload;
          break
        case "next_proposal":
          this.results = []
          this.voting = true
          this.resultsAvailable = false
          this.resultsReady = false
          this.currentProposal = eventData.payload;
          break;
        default:
          alert("Unsupported action");
          break;
      }
    },

    startCountdown(initialTime) {
      // Inicializa el contador con el valor proporcionado
      this.countdown = initialTime;
      // Si ya existe un timer activo, se detiene
      if (this.timer) clearInterval(this.timer);
      // Inicia el timer que decrementa el contador cada segundo
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.timer);
          this.timer = null;

          this.resultsAvailable = true;
          this.voting = false;
        }
      }, 1000);
    },
    stopCountdown() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    attemptReconnect() {
      this.reconnecting = true;
      this.reconnectAttempts += 1;
      const delay = this.reconnectBaseDelay * Math.pow(2, this.reconnectAttempts - 1);
      this.pushMessage(`Intentando reconectar en ${delay / 1000} segundos...`);
      setTimeout(() => {
        this.pushMessage(`Intento de reconexión #${this.reconnectAttempts}`);
        this.connect(this.socketUrl);
      }, delay);
    },
  },
})
