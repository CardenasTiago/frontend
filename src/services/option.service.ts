import ApiService from "./ApiService";

const OptionService = {
  list(): Promise<string> {
    return ApiService.get('/options');
  },
  find(id: string): Promise<string> {
    return ApiService.get(`/options/${id}`);
  },
  create(payload: any): Promise<string> {
    return ApiService.post('/options', payload);
  },
  update(id : string, payload: any): Promise<string> {
    return ApiService.put(`/options/${id}`, payload);
  },
  remove(id: string): Promise<string> {
    return ApiService.delete(`/options/${id}`);
  },
};

export default OptionService;