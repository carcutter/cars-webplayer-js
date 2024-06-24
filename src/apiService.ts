import { Composition } from "@/types/composition";

class ApiService {
  async getComposition(url: string): Promise<Composition> {
    const res = await fetch(url);
    return res.json();
  }
}

const apiService = new ApiService();

export default apiService;
