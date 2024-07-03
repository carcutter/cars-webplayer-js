import { Composition, CompositionSchema } from "@/types/composition";

class ApiService {
  async getComposition(url: string): Promise<Composition> {
    const res = await fetch(url);
    const data: unknown = await res.json();

    const parsedData = CompositionSchema.safeParse(data);

    if (!parsedData.success) {
      // eslint-disable-next-line no-console
      console.error(parsedData.error.issues);
      throw new Error("Failed to parse composition data");
    }

    return parsedData.data;
  }
}

const apiService = new ApiService();

export default apiService;
