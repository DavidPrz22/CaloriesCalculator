import { z } from "zod";
export const SearchFoodQuerySchema = z.object({
    query: z.string().min(2, "Query must be at least 2 characters long"),
    lang: z.enum(["EN", "ES"]),
    categoriaId: z.coerce.number(),
});
const foodArgs = z.object({
    fdcId: z.coerce.number().min(0, "Number has to be minimum 0"),
    amount: z.coerce.number().min(1, "Number has to be minimum 1"),
});
export const calculateNutrientsArgs = z.array(foodArgs);
export const NutritionSchema = z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
});
export const CalculatedItemSchema = z.object({
    fdcId: z.number(),
    names: z.object({
        en: z.string(),
        es: z.string(),
    }),
    nutrition: NutritionSchema,
    amount: z.number(),
});
export const CalculateNutrientsResponseSchema = z.object({
    items: z.array(CalculatedItemSchema),
    totals: NutritionSchema,
});
export const ConsumoDetalleInputSchema = z.object({
    comidaId: z.number(),
    cantidad_consumida: z.number().min(1),
    calorias_consumida: z.number().min(0),
    proteinas_consumida: z.number().min(0),
    carbohidratos_consumida: z.number().min(0),
    grasas_consumida: z.number().min(0),
});
export const SaveConsumptionInputSchema = z.object({
    calorias_consumidas: z.number().min(0),
    proteinas_consumidas: z.number().min(0),
    carbohidratos_consumidos: z.number().min(0),
    grasas_consumidas: z.number().min(0),
    detalles: z.array(ConsumoDetalleInputSchema).min(1),
});
export const CreateComidaSchema = z.object({
    FDCID: z.number(),
    nameES: z.string().min(1),
    nameEN: z.string().min(1),
    categoriaId: z.number(),
    medidaId: z.number(),
    calories: z.number().nullable().optional(),
    protein: z.number().nullable().optional(),
    carbs: z.number().nullable().optional(),
    fat: z.number().nullable().optional(),
});
export const UpdateComidaSchema = CreateComidaSchema.partial();
export const GetConsumptionsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(50),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
});
export const ConsumoDetalleComidaSchema = z.object({
    id: z.number(),
    FDCID: z.number(),
    nameES: z.string(),
    nameEN: z.string(),
    medidaId: z.number(),
});
export const ConsumoDetalleResponseSchema = z.object({
    id: z.number(),
    comidaId: z.number(),
    cantidad_consumida: z.number(),
    calorias_consumida: z.number(),
    grasas_consumidas: z.number(),
    proteinas_consumidas: z.number(),
    carbohidratos_consumidos: z.number(),
    dataConsumoId: z.number(),
    comida: ConsumoDetalleComidaSchema.optional(),
});
export const ConsumptionItemSchema = z.object({
    id: z.number(),
    calorias_consumidas: z.number(),
    grasas_consumidas: z.number(),
    proteinas_consumidas: z.number(),
    carbohidratos_consumidos: z.number(),
    timestamp: z.string().or(z.date()),
    userId: z.number(),
});
export const ConsumptionsResponseSchema = z.object({
    items: z.array(ConsumptionItemSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
});
export const ConsumptionDetailResponseSchema = ConsumptionItemSchema.extend({
    detalles: z.array(ConsumoDetalleResponseSchema),
});
//# sourceMappingURL=zod.js.map