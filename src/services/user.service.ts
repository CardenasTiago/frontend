import ApiService from "./ApiService";
import type { ServiceError } from "./types/ServiceError";

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
 
  async login(payload: any): Promise<string> {
    try {
      return await ApiService.post('/users/login', payload);
    } catch (err: any) {
      // Extraemos código y mensaje de error
      const status = err.response?.status ?? err.status ?? 500;
      const error = err.response?.data?.error ?? err.response?.data?.message ?? err.message;
      throw { status, error } as ServiceError;
    }
  },
};

export default UserService;
