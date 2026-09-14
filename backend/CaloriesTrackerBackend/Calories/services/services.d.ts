import type { ComidaModel } from '@/prisma/generated/prisma/models/Comida';
import type { Nutrition } from '../zod';
type MacroKey = 'calories' | 'protein' | 'carbs' | 'fat';
export declare class CaloriesService {
    static calculateNutrient(data: ComidaModel, amount: number, key: MacroKey): number;
    static calculateCalories: (data: ComidaModel, amount: number) => number;
    static calculateProtein: (data: ComidaModel, amount: number) => number;
    static calculateCarbs: (data: ComidaModel, amount: number) => number;
    static calculateFats: (data: ComidaModel, amount: number) => number;
    static calculateItemNutrition(data: ComidaModel, amount: number): Nutrition;
    static calculateTotalNutrition(items: Nutrition[]): Nutrition;
}
export {};
//# sourceMappingURL=services.d.ts.map