import { apiClient } from "@/api";
import { apiRequest } from "@/lib/api-error";
import { CategoriesResponseSchema, UnitsResponseSchema, SearchFoodResponseSchema, CalculateNutrientsResponseSchema, FoodArgSchema, SaveConsumptionRequestSchema } from "../schemas/schemas";
import type { Categoria, Medida, Comida, BackendLang } from "../types/types";
import type { FoodArg, CalculateNutrientsResponse, SaveConsumptionRequest } from "../schemas/schemas";

export async function fetchCategories(): Promise<Categoria[]> {
  const data = await apiRequest(
    apiClient.get<{ categories: Categoria[] }>("/api/calories/categories"),
    "fetchCategories"
  );
  return CategoriesResponseSchema.parse(data).categories;
}

export async function fetchUnits(): Promise<Medida[]> {
  const data = await apiRequest(
    apiClient.get<{ units: Medida[] }>("/api/calories/units"),
    "fetchUnits"
  );
  return UnitsResponseSchema.parse(data).units;
}

export async function searchFood(params: {
  query: string;
  categoriaId: number;
  lang: BackendLang;
}): Promise<Comida[]> {
  const { query, categoriaId, lang } = params;
  const searchParams = new URLSearchParams({
    query,
    lang,
    categoriaId: String(categoriaId),
  });
  const data = await apiRequest(
    apiClient.get<{ foods: Comida[] }>(`/api/calories/search-food?${searchParams}`),
    "searchFood"
  );
  return SearchFoodResponseSchema.parse(data).foods;
}

export async function calculateNutrition(items: FoodArg[]): Promise<CalculateNutrientsResponse> {
  const validatedItems = FoodArgSchema.array().parse(items);
  const data = await apiRequest(
    apiClient.post<CalculateNutrientsResponse>("/api/calories/calculate", validatedItems.length > 0 ? validatedItems : []),
    "calculateNutrition"
  );
  return CalculateNutrientsResponseSchema.parse(data);
}

export interface SavedConsumptionResponse {
  id: number;
  calorias_consumidas: number;
  grasas_consumidas: number;
  proteinas_consumidas: number;
  carbohidratos_consumidos: number;
  timestamp: string;
  userId: number;
  detalles: Array<{
    id: number;
    comidaId: number;
    cantidad_consumida: number;
    calorias_consumida: number;
    grasas_consumidas: number;
    proteinas_consumidas: number;
    carbohidratos_consumidos: number;
    dataConsumoId: number;
  }>;
}

export async function saveConsumption(request: SaveConsumptionRequest): Promise<SavedConsumptionResponse> {
  const validatedRequest = SaveConsumptionRequestSchema.parse(request);
  const data = await apiRequest(
    apiClient.post<SavedConsumptionResponse>("/api/calories/save-consumption", validatedRequest),
    "saveConsumption"
  );
  return data;
}
