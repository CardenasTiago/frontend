import ApiService from "./ApiService";

const RoomService = {
  list(): Promise<string> {
    return ApiService.get('/rooms');
  },
  find(id: string): Promise<string> {
    return ApiService.get(`/rooms/${id}`);
  },
  create(payload: any): Promise<string> {
    return ApiService.post('/rooms', payload);
  },
  update(id : string, payload: any): Promise<string> {
    return ApiService.put(`/rooms/${id}`, payload);
  },
  remove(id: string): Promise<string> {
    return ApiService.delete(`/rooms/${id}`);
  },
  login(payload: any): Promise<string> {
    return ApiService.post('/rooms/login', payload);
  },
  join(payload : any): Promise<string> {
    return ApiService.post('/rooms/join', payload);
  },
  adminRooms(): Promise<string> {
    return ApiService.get('/rooms/myRooms')
  },
  addUser(payload : any): Promise<string> {
    return ApiService.post('rooms/addUser', payload)
  },
  removeUser(payload : any) : Promise<string> {
    return ApiService.delete('rooms/whitelist/removeUser', payload)
  }
};

export default RoomService;
