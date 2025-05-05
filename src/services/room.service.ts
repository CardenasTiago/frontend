import ApiService from "./ApiService";

// const API_BASE = import.meta.env.PUBLIC_API_BASE_URL as string;
// // Si tu BACKEND corre en https, querrás wss, si no ws:
// const WS_SCHEME = API_BASE.startsWith("https") ? "wss" : "ws";
// // Y extrajimos host+puerto:
// const WS_HOST = API_BASE.replace(/^https?:\/\//, "");


class RoomSocket {
  private url: string;
  private sock: WebSocket | null = null;
  private reconnectDelay = 1000;      // 1s inicial
  private maxDelay       = 30000;     // hasta 30s
  private shouldReconnect = true;

  constructor(roomId: string) {
    const base = import.meta.env.PUBLIC_API_BASE_URL ?? "";
    const scheme = base.startsWith("https") ? "wss" : "ws";
    const host  = base.replace(/^https?:\/\//, "");
    this.url = `${scheme}://${host}/rooms/ws/${roomId}`;
    this.connect();
  }

  public onOpen: (() => void) | null  = null;
  public onClose: ((event: CloseEvent) => void)| null  = null;
  /** callback que puedes asignar desde el componente */
  public onMessage: ((data: any) => void) | null = null;

  private connect() {
    this.sock = new WebSocket(this.url);

    this.sock.onopen = () => {
      console.log('WS conectado a', this.url);
      // restablecemos el back‐off
      this.reconnectDelay = 1000;
      if (this.onOpen) this.onOpen();
    };

    this.sock.onmessage = (ev) => {
      // reenvía el mensaje a quien lo consuma
      if (this.onMessage) this.onMessage(JSON.parse(ev.data));
    };

    this.sock.onerror = (err) => {
      console.error('WS error', err);
    };

    this.sock.onclose = (ev) => {
      console.log('WS cerrado con código', ev.code);
      this.onClose?.(ev);

      // Si el backend rechaza duplicados (4001 o 4002), no reintentamos
      if (ev.code === 4001 || ev.code === 4002) {
        this.shouldReconnect = false;
        return;
      }

      if (!this.shouldReconnect) return;
      setTimeout(() => {
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxDelay);
        this.connect();
      }, this.reconnectDelay);
    };
  }



  /** enviar mensaje JSON */
  public send(payload: any) {
    if (this.sock?.readyState === WebSocket.OPEN) {
      this.sock.send(JSON.stringify(payload));
    } else {
      console.warn('WS no abierto, mensaje descartado:', payload);
    }
  }

  /** cierra y evita más reconexiones */
  close() {
    this.shouldReconnect = false;
    this.sock?.close();
  }
}

const RoomService = {
  list(): Promise<string> {
    return ApiService.get("/rooms");
  },
  find(id: string): Promise<string> {
    return ApiService.get(`/rooms/${id}`);
  },
  create(payload: any): Promise<string> {
    return ApiService.post("/rooms", payload);
  },
  update(id: string, payload: any): Promise<string> {
    return ApiService.put(`/rooms/${id}`, payload);
  },
  remove(id: string): Promise<string> {
    return ApiService.delete(`/rooms/${id}`);
  },
  login(payload: any): Promise<string> {
    return ApiService.post("/rooms/login", payload);
  },
  join(payload: any): Promise<string> {
    return ApiService.post("/rooms/join", payload);
  },
  adminRooms(): Promise<string> {
    return ApiService.get("/rooms/myRooms");
  },
  addUser(payload: any): Promise<string> {
    return ApiService.post("rooms/addUser", payload);
  },
  removeUser(payload: any): Promise<string> {
    return ApiService.delete("rooms/whitelist/removeUser", payload);
  },
  history(): Promise<string> {
    return ApiService.get("rooms/history");
  },
  socket(roomId: string): RoomSocket {
    return new RoomSocket(roomId);
  }
};

export default RoomService;
