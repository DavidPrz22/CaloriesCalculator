import { queryOptions } from "@tanstack/react-query";
import { getConsumptionDetail, getConsumptions } from "../../api/api";
import type { ConsumptionsApiResponse, itemsHistory } from "../../types/types";
import type { ConsumoRecord } from "@/ZustandStores/useHistoryStore";

export const CONSUMPTION_DETAIL_KEY = "consumption-detail"
export const consumptionDetailQueryOptions = (id: number | null) => queryOptions({
  queryKey: [CONSUMPTION_DETAIL_KEY, id],
  queryFn: () => getConsumptionDetail(id!),
  enabled: id !== null,
});

export const CONSUMPTION_KEY = "consumption-history"
export const consumptionHistoryQueryOptions = (page: number, limit: number, startDate?: string, endDate?: string) => queryOptions({
  queryKey: [CONSUMPTION_KEY, page, limit, startDate, endDate],
  queryFn: () => getConsumptions(page, limit, startDate, endDate),
  select: (data: ConsumptionsApiResponse): ConsumoRecord[] => data.items.map((item: itemsHistory[number]) => ({
    id: item.id,
    timestamp: new Date(item.timestamp).toISOString(),
    calorias_consumidas: item.calorias_consumidas,
    protein_consumida: item.proteinas_consumidas,
    carbs_consumida: item.carbohidratos_consumidos,
    fat_consumida: item.grasas_consumidas,
    detalles: [],
  })),
});
