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
  update(payload: any): Promise<string> {
    return ApiService.put(`/users/`, payload);
  },
  remove(id: string): Promise<string> {
    return ApiService.delete(`/users/${id}`);
  },
  login(payload: any): Promise<string> {
    return ApiService.post('/users/login', payload);
  },
  async authCheck(): Promise<boolean> {
    try {
      await ApiService.get('/users/auth');
      return true;
    } catch (_: any) {
      return false;
    }
  },
  logout(): Promise<string> {
    return ApiService.post('/users/logout')
  },
  whitelist(id : string) : Promise<string> {
    return ApiService.get(`/users/byRoom/${id}`)
  }
};

export default UserService;
