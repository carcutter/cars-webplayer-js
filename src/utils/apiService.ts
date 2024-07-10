import type { Composition } from "@/types/composition";
import { CompositionSchema } from "@/types/zod/composition";

class ApiService {
  async getComposition(url: string): Promise<Composition> {
    const res = await fetch(url);
    const data: unknown = await res.json();

    const parsedData = CompositionSchema.parse(data);

    return parsedData;
  }
}

const apiService = new ApiService();

export default apiService;
