// src/services/ApiService.ts
import http from './http-common';

const ApiService = {
  get(resource: string): Promise<string> {
    return http.get(resource)
      .then((resp: any) => JSON.stringify(resp.data));         // devuelvo JSON como string
  },
  post(resource: string, data: any): Promise<string> {
    return http.post(resource, data)
      .then((resp: any) => JSON.stringify(resp.data));
  },
  put(resource: string, data: any): Promise<string> {
    return http.put(resource, data)
      .then((resp: any) => JSON.stringify(resp.data));
  },
  delete(resource: string): Promise<string> {
    return http.delete(resource)
      .then((resp: any) => JSON.stringify(resp.data));
  }
};

export default ApiService;
