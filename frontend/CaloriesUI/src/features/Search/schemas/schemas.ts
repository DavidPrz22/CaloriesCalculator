import { z } from "zod";

export const CategoriaSchema = z.object({
  id: z.number(),
  nameES: z.string(),
  nameEN: z.string(),
});

export const MedidaSchema = z.object({
  id: z.number(),
  nameES: z.string(),
  nameEN: z.string(),
  abreviation: z.string(),
});

export const ComidaSchema = z.object({
  id: z.number(),
  FDCID: z.number(),
  nameES: z.string(),
  nameEN: z.string(),
  categoria: CategoriaSchema,
  medida: MedidaSchema,
  calories: z.number().nullable(),
  protein: z.number().nullable(),
  carbs: z.number().nullable(),
  fat: z.number().nullable(),
});

export const CategoriesResponseSchema = z.object({
  categories: z.array(CategoriaSchema),
});

export const UnitsResponseSchema = z.object({
  units: z.array(MedidaSchema),
});

export const SearchFoodResponseSchema = z.object({
  foods: z.array(ComidaSchema),
});

export const SearchFoodQuerySchema = z.object({
  query: z.string().min(2, "Query must be at least 2 characters"),
  lang: z.enum(["EN", "ES"]),
  categoriaId: z.coerce.number(),
});

export type SearchFoodQuery = z.infer<typeof SearchFoodQuerySchema>;

export const FoodArgSchema = z.object({
  fdcId: z.number(),
  amount: z.number(),
});

export const NutritionSchema = z.object({
  calories: z.number().nullable(),
  protein: z.number().nullable(),
  carbs: z.number().nullable(),
  fat: z.number().nullable(),
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

export type FoodArg = z.infer<typeof FoodArgSchema>;
export type Nutrition = z.infer<typeof NutritionSchema>;
export type CalculatedItem = z.infer<typeof CalculatedItemSchema>;
export type CalculateNutrientsResponse = z.infer<typeof CalculateNutrientsResponseSchema>;

export const SaveConsumptionRequestSchema = z.object({
    calorias_consumidas: z.number(),
    proteinas_consumidas: z.number(),
    carbohidratos_consumidos: z.number(),
    grasas_consumidas: z.number(),
    detalles: z.array(z.object({
        comidaId: z.number(),
        cantidad_consumida: z.number(),
        calorias_consumida: z.number(),
        proteinas_consumida: z.number(),
        carbohidratos_consumida: z.number(),
        grasas_consumida: z.number(),
    })).min(1),
});

export type SaveConsumptionRequest = z.infer<typeof SaveConsumptionRequestSchema>;
