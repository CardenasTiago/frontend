import ApiService from "./ApiService";

const ProposalService = {
  list(): Promise<string> {
    return ApiService.get('/proposals');
  },
  find(id: string): Promise<string> {
    return ApiService.get(`/proposals/${id}`);
  },
  create(payload: any): Promise<string> {
    return ApiService.post('/proposals', payload);
  },
  update(id : string, payload: any): Promise<string> {
    return ApiService.put(`/proposals/${id}`, payload);
  },
  remove(id: string): Promise<string> {
    return ApiService.delete(`/proposals/${id}`);
  },
  byRoom(room_id : string): Promise<string> {
    return ApiService.get(`/proposals/byRoom/${room_id}`)
  }
};

export default ProposalService;
