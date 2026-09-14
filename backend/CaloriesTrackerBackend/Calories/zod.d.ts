import { z } from "zod";
export declare const SearchFoodQuerySchema: z.ZodObject<{
    query: z.ZodString;
    lang: z.ZodEnum<{
        EN: "EN";
        ES: "ES";
    }>;
    categoriaId: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const calculateNutrientsArgs: z.ZodArray<z.ZodObject<{
    fdcId: z.ZodCoercedNumber<unknown>;
    amount: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>>;
export type SearchFoodQuery = z.infer<typeof SearchFoodQuerySchema>;
export type CalculateNutrientsInput = z.infer<typeof calculateNutrientsArgs>;
export declare const NutritionSchema: z.ZodObject<{
    calories: z.ZodNumber;
    protein: z.ZodNumber;
    carbs: z.ZodNumber;
    fat: z.ZodNumber;
}, z.core.$strip>;
export declare const CalculatedItemSchema: z.ZodObject<{
    fdcId: z.ZodNumber;
    names: z.ZodObject<{
        en: z.ZodString;
        es: z.ZodString;
    }, z.core.$strip>;
    nutrition: z.ZodObject<{
        calories: z.ZodNumber;
        protein: z.ZodNumber;
        carbs: z.ZodNumber;
        fat: z.ZodNumber;
    }, z.core.$strip>;
    amount: z.ZodNumber;
}, z.core.$strip>;
export declare const CalculateNutrientsResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        fdcId: z.ZodNumber;
        names: z.ZodObject<{
            en: z.ZodString;
            es: z.ZodString;
        }, z.core.$strip>;
        nutrition: z.ZodObject<{
            calories: z.ZodNumber;
            protein: z.ZodNumber;
            carbs: z.ZodNumber;
            fat: z.ZodNumber;
        }, z.core.$strip>;
        amount: z.ZodNumber;
    }, z.core.$strip>>;
    totals: z.ZodObject<{
        calories: z.ZodNumber;
        protein: z.ZodNumber;
        carbs: z.ZodNumber;
        fat: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export type Nutrition = z.infer<typeof NutritionSchema>;
export type CalculatedItem = z.infer<typeof CalculatedItemSchema>;
export type CalculateNutrientsResponse = z.infer<typeof CalculateNutrientsResponseSchema>;
export declare const ConsumoDetalleInputSchema: z.ZodObject<{
    comidaId: z.ZodNumber;
    cantidad_consumida: z.ZodNumber;
    calorias_consumida: z.ZodNumber;
    proteinas_consumida: z.ZodNumber;
    carbohidratos_consumida: z.ZodNumber;
    grasas_consumida: z.ZodNumber;
}, z.core.$strip>;
export declare const SaveConsumptionInputSchema: z.ZodObject<{
    calorias_consumidas: z.ZodNumber;
    proteinas_consumidas: z.ZodNumber;
    carbohidratos_consumidos: z.ZodNumber;
    grasas_consumidas: z.ZodNumber;
    detalles: z.ZodArray<z.ZodObject<{
        comidaId: z.ZodNumber;
        cantidad_consumida: z.ZodNumber;
        calorias_consumida: z.ZodNumber;
        proteinas_consumida: z.ZodNumber;
        carbohidratos_consumida: z.ZodNumber;
        grasas_consumida: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SaveConsumptionInput = z.infer<typeof SaveConsumptionInputSchema>;
export declare const CreateComidaSchema: z.ZodObject<{
    FDCID: z.ZodNumber;
    nameES: z.ZodString;
    nameEN: z.ZodString;
    categoriaId: z.ZodNumber;
    medidaId: z.ZodNumber;
    calories: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    protein: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    carbs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    fat: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>;
export declare const UpdateComidaSchema: z.ZodObject<{
    FDCID: z.ZodOptional<z.ZodNumber>;
    nameES: z.ZodOptional<z.ZodString>;
    nameEN: z.ZodOptional<z.ZodString>;
    categoriaId: z.ZodOptional<z.ZodNumber>;
    medidaId: z.ZodOptional<z.ZodNumber>;
    calories: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    protein: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    carbs: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    fat: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
}, z.core.$strip>;
export declare const GetConsumptionsQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetConsumptionsQuery = z.infer<typeof GetConsumptionsQuerySchema>;
export declare const ConsumoDetalleComidaSchema: z.ZodObject<{
    id: z.ZodNumber;
    FDCID: z.ZodNumber;
    nameES: z.ZodString;
    nameEN: z.ZodString;
    medidaId: z.ZodNumber;
}, z.core.$strip>;
export declare const ConsumoDetalleResponseSchema: z.ZodObject<{
    id: z.ZodNumber;
    comidaId: z.ZodNumber;
    cantidad_consumida: z.ZodNumber;
    calorias_consumida: z.ZodNumber;
    grasas_consumidas: z.ZodNumber;
    proteinas_consumidas: z.ZodNumber;
    carbohidratos_consumidos: z.ZodNumber;
    dataConsumoId: z.ZodNumber;
    comida: z.ZodOptional<z.ZodObject<{
        id: z.ZodNumber;
        FDCID: z.ZodNumber;
        nameES: z.ZodString;
        nameEN: z.ZodString;
        medidaId: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const ConsumptionItemSchema: z.ZodObject<{
    id: z.ZodNumber;
    calorias_consumidas: z.ZodNumber;
    grasas_consumidas: z.ZodNumber;
    proteinas_consumidas: z.ZodNumber;
    carbohidratos_consumidos: z.ZodNumber;
    timestamp: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    userId: z.ZodNumber;
}, z.core.$strip>;
export declare const ConsumptionsResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        calorias_consumidas: z.ZodNumber;
        grasas_consumidas: z.ZodNumber;
        proteinas_consumidas: z.ZodNumber;
        carbohidratos_consumidos: z.ZodNumber;
        timestamp: z.ZodUnion<[z.ZodString, z.ZodDate]>;
        userId: z.ZodNumber;
    }, z.core.$strip>>;
    total: z.ZodNumber;
    page: z.ZodNumber;
    limit: z.ZodNumber;
    totalPages: z.ZodNumber;
}, z.core.$strip>;
export type ConsumptionItem = z.infer<typeof ConsumptionItemSchema>;
export type ConsumoDetalleResponse = z.infer<typeof ConsumoDetalleResponseSchema>;
export type ConsumptionsResponse = z.infer<typeof ConsumptionsResponseSchema>;
export declare const ConsumptionDetailResponseSchema: z.ZodObject<{
    id: z.ZodNumber;
    calorias_consumidas: z.ZodNumber;
    grasas_consumidas: z.ZodNumber;
    proteinas_consumidas: z.ZodNumber;
    carbohidratos_consumidos: z.ZodNumber;
    timestamp: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    userId: z.ZodNumber;
    detalles: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        comidaId: z.ZodNumber;
        cantidad_consumida: z.ZodNumber;
        calorias_consumida: z.ZodNumber;
        grasas_consumidas: z.ZodNumber;
        proteinas_consumidas: z.ZodNumber;
        carbohidratos_consumidos: z.ZodNumber;
        dataConsumoId: z.ZodNumber;
        comida: z.ZodOptional<z.ZodObject<{
            id: z.ZodNumber;
            FDCID: z.ZodNumber;
            nameES: z.ZodString;
            nameEN: z.ZodString;
            medidaId: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ConsumptionDetailResponse = z.infer<typeof ConsumptionDetailResponseSchema>;
//# sourceMappingURL=zod.d.ts.map