// src/services/ApiService.ts
import http from './http-common';
import type {  AxiosResponse } from 'axios';

export interface ServiceError {
  status: number;
  error: string;
}

/**
 * Envuelve cualquier llamada axios y extrae status + mensaje de error.
 * Devuelve el body serializado o lanza ServiceError.
 * Es como un middleware
 */
async function requestWrapper(
  fn: Promise<AxiosResponse<any>>
): Promise<string> {
  try {
    const res = await fn;
    return JSON.stringify(res.data);
  } catch (err: any) {
    // extraemos status y error con prioridad a response.data.error
    const status = err.response?.status ?? err.status ?? 500;
    const error =
      err.response?.data?.error ??
      err.response?.data?.message ??
      err.message ??
      'Error inesperado';
    throw { status, error } as ServiceError;
  }
}

const ApiService = {
  get(path: string): Promise<string> {
    return requestWrapper(http.get(path));
  },
  post(path: string, payload?: any): Promise<string> {
    return requestWrapper(http.post(path, payload));
  },
  put(path: string, payload?: any): Promise<string> {
    return requestWrapper(http.put(path, payload));
  },
  delete(path: string, payload?: any): Promise<string> {
    if (payload !== undefined) {
      return requestWrapper(
        http.delete(path, { data: payload })
      );
    }
    return requestWrapper(http.delete(path));
  },
};

export default ApiService;
