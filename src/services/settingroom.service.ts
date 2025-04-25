import ApiService from "./ApiService";

const SettingRoomService = {
  list(): Promise<string> {
    return ApiService.get('/settingsRoom');
  },
  find(id: string): Promise<string> {
    return ApiService.get(`/settingsRoom/${id}`);
  },
  create(payload: any): Promise<string> {
    return ApiService.post('/settingsRoom', payload);
  },
  update(id : string, payload: any): Promise<string> {
    return ApiService.put(`/settingsRoom/${id}`, payload);
  },
  remove(id: string): Promise<string> {
    return ApiService.delete(`/settingsRoom/${id}`);
  },
  byRoom(room_id : string): Promise<string> {
    return ApiService.get(`/settingsRoom/byRoom/${room_id}`)
  }
};

export default SettingRoomService;