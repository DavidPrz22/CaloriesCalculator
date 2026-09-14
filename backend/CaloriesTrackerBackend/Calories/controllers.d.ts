import { type lang } from "./types";
import { type CalculateNutrientsInput, type CalculateNutrientsResponse, type SaveConsumptionInput } from './zod';
export declare class CaloriesFoodController {
    static retrieveFoodsCategories(): Promise<{
        nameES: string;
        nameEN: string;
        id: number;
    }[]>;
    static retrieveFoodsMeasures(): Promise<{
        nameES: string;
        nameEN: string;
        id: number;
        abreviation: string;
    }[]>;
    static searchFoodbyQuery(query: string, lang: lang, categoriaId: number): Promise<{
        calories: number | null;
        protein: number | null;
        carbs: number | null;
        fat: number | null;
        FDCID: number;
        nameES: string;
        nameEN: string;
        id: number;
        categoria: {
            nameES: string;
            nameEN: string;
            id: number;
        };
        medida: {
            nameES: string;
            nameEN: string;
            id: number;
            abreviation: string;
        };
    }[]>;
    private static fetchFoodsByFdcIds;
    static calculateNutrients(input: CalculateNutrientsInput): Promise<CalculateNutrientsResponse>;
    static saveConsumption(input: SaveConsumptionInput, userId: number): Promise<{
        id: number;
        calorias_consumidas: number;
        grasas_consumidas: number;
        proteinas_consumidas: number;
        carbohidratos_consumidos: number;
        timestamp: string;
        userId: number;
        detalles: {
            id: number;
            comidaId: number;
            cantidad_consumida: number;
            calorias_consumida: number;
            grasas_consumidas: number;
            proteinas_consumidas: number;
            carbohidratos_consumidos: number;
            dataConsumoId: number;
        }[];
    }>;
    static getComidas(page?: number, limit?: number, search?: string): Promise<{
        items: ({
            categoria: {
                nameES: string;
                nameEN: string;
                id: number;
            };
            medida: {
                nameES: string;
                nameEN: string;
                id: number;
                abreviation: string;
            };
        } & {
            categoriaId: number;
            calories: number | null;
            protein: number | null;
            carbs: number | null;
            fat: number | null;
            FDCID: number;
            nameES: string;
            nameEN: string;
            medidaId: number;
            id: number;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    static createComida(data: any): Promise<{
        categoriaId: number;
        calories: number | null;
        protein: number | null;
        carbs: number | null;
        fat: number | null;
        FDCID: number;
        nameES: string;
        nameEN: string;
        medidaId: number;
        id: number;
    }>;
    static updateComida(id: number, data: any): Promise<{
        categoriaId: number;
        calories: number | null;
        protein: number | null;
        carbs: number | null;
        fat: number | null;
        FDCID: number;
        nameES: string;
        nameEN: string;
        medidaId: number;
        id: number;
    }>;
    static deleteComida(id: number): Promise<{
        categoriaId: number;
        calories: number | null;
        protein: number | null;
        carbs: number | null;
        fat: number | null;
        FDCID: number;
        nameES: string;
        nameEN: string;
        medidaId: number;
        id: number;
    }>;
    static getConsumptions(userId: number, page?: number, limit?: number, startDate?: string, endDate?: string): Promise<{
        items: {
            calorias_consumidas: number;
            proteinas_consumidas: number;
            carbohidratos_consumidos: number;
            grasas_consumidas: number;
            id: number;
            timestamp: Date;
            userId: number;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    static deleteConsumption(id: number, userId: number): Promise<{
        calorias_consumidas: number;
        proteinas_consumidas: number;
        carbohidratos_consumidos: number;
        grasas_consumidas: number;
        id: number;
        timestamp: Date;
        userId: number;
    }>;
    static getConsumptionDetail(id: number, userId: number): Promise<({
        detalles: ({
            comida: {
                FDCID: number;
                nameES: string;
                nameEN: string;
                medidaId: number;
                id: number;
            };
        } & {
            comidaId: number;
            cantidad_consumida: number;
            calorias_consumida: number;
            proteinas_consumidas: number;
            carbohidratos_consumidos: number;
            grasas_consumidas: number;
            id: number;
            dataConsumoId: number;
        })[];
    } & {
        calorias_consumidas: number;
        proteinas_consumidas: number;
        carbohidratos_consumidos: number;
        grasas_consumidas: number;
        id: number;
        timestamp: Date;
        userId: number;
    }) | null>;
}
//# sourceMappingURL=controllers.d.ts.map