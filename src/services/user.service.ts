import ApiService from "./ApiService";

const UserService = {
  list(): Promise<string> {
    return ApiService.get('/users');
  },
  find(id: string): Promise<string> {
    return ApiService.get(`/users/${id}`);
  },
  create(payload: any): Promise<string> {
    return ApiService.post('/users', payload);
  },
  update(id: string, payload: any): Promise<string> {
    return ApiService.put(`/users/${id}`, payload);
  },
  remove(id: string): Promise<string> {
    return ApiService.delete(`/users/${id}`);
  },
  login(payload: any): Promise<string> {
    return ApiService.post('/users/login', payload);
  },
};

export default UserService;
