import { defineStore } from 'pinia'
import RoomService from '../../../services/room.service';

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
    redirectMenu: false,
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
    onOpen: () => { this.connected = true; },
    onClose: () => { this.connected = false; },
    connect(roomId) {
      if (this.socket) return;
      this.roomId = roomId;
      const socket = RoomService.socket(roomId);

      // 🚩 asignamos los callbacks públicos del wrapper
      socket.onOpen = () => { this.connected = true; };
      socket.onMessage = (data) => { this.receiveEvents(data); };

      socket.onClose = (ev) => {
        this.connected = false;
        this.socket = null;

        if (ev.code === 4001) {
          this.pushMessage('No puedes unirte: la sala no existe.', false);
        } else if (ev.code === 4002) {
          alert('No puedes unirte: sesión duplicada en la sala.', false);
          this.redirectMenu = true;
        } else {
          this.pushMessage('Conexión interrumpida. Reintentando...', false);
        }
      };
      // helper para enviar
      socket.sendEvents = (action, payload) => {
        socket.send(new Event(action, payload));
      };

      this.socket = socket;
    },

    close() {
      if (!this.socket) return;
      this.socket.close();  // detiene reconexión automática
      this.socket = null;
      this.connected = false;
    },


    pushMessage(msg, isCurrentUser = false) {
      this.messages.push({ text: msg, isCurrentUser });
    },

    updateClientList(payload) {
      const data = typeof payload === 'string' ? JSON.parse(payload) : payload
      this.userList = data.clients || []
    },

    close() {
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
          this.pushMessage(`${eventData.payload.from} : ${eventData.payload.message}`, false);
          break;
        case "update_client_list":
          this.updateClientList(eventData.payload);
          break;
        case "first_proposal":
          this.voting = true
          //por las dudas reseteo los resultados
          this.resultsAvailable = false;
          this.resultsReady = false;
          this.currentProposal = eventData.payload;
          break;
        case "results":
          this.resultsReady = true;
          this.results = eventData.payload;
          break
        case "next_proposal":
          this.results = []
          this.voting = true
          this.resultsAvailable = false
          this.resultsReady = false
          this.currentProposal = eventData.payload;
          break;
        case "kick_user": //lo ve el que es kickeado
          this.close()
          window.location.href = '/protected/menu'
          break;
        case "kick_info":// lo ve el resto de la sala
          alert("un usuario fue expulsado");
          break
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
        if (this.countdown > 0 && !this.resultsAvailable) {
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
  },
})
