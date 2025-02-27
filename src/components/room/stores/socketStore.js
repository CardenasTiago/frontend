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
    firstProposal: null,
  }),

  actions: {
    connect(url) {

      if (this.socket !== null) {
        console.warn('Ya estás conectado al WebSocket.');
        return;
      }

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
        pushMessage('Error en la conexión WebSocket.');
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
          this.voting = true
          this.firstProposal = eventData.payload;
          break;
        default:
          alert("Unsupported action");
          break;
      }
    },

    attemptReconnect()  {
      this.reconnecting = true;
      this.reconnectAttempts += 1;
      const delay = this.reconnectBaseDelay * Math.pow(2, this.reconnectAttempts - 1);
      this.pushMessage(`Intentando reconectar en ${delay / 1000} segundos...`);
      setTimeout(() => {
        this.pushMessage(`Intento de reconexión #${this.reconnectAttempts}`);
        this.connect();
      }, delay);
    },
  },
})
