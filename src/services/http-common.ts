// src/services/http-common.ts
import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.PUBLIC_API_BASE_URL as string,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

http.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    // Asegúrate de que headers exista antes de asignar
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(import.meta.env.PUBLIC_API_BASE_URL)
  return config;
});

http.interceptors.response.use(
  (resp: AxiosResponse) => resp,
  err => Promise.reject(err)
);

export default http;
