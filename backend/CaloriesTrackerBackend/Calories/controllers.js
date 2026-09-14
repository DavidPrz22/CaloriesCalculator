import { prisma } from '@/prisma/lib/prisma';
import {} from "./types";
import {} from './zod';
import { CaloriesService } from './services/services';
export class CaloriesFoodController {
    static async retrieveFoodsCategories() {
        return await prisma.categoria.findMany();
    }
    static async retrieveFoodsMeasures() {
        return await prisma.medida.findMany();
    }
    static async searchFoodbyQuery(query, lang, categoriaId) {
        const userinput = query.trim();
        if (userinput.length < 2) {
            throw new Error("Invalid query length");
        }
        const searchColumn = lang === "EN" ? "nameEN" : "nameES";
        const cachedData = await prisma.comida.findMany({
            where: {
                [searchColumn]: {
                    contains: userinput,
                    mode: 'insensitive',
                },
                ...(categoriaId !== 1 && {
                    categoriaId: categoriaId,
                }),
            },
            select: {
                id: true,
                FDCID: true,
                nameES: true,
                nameEN: true,
                calories: true,
                protein: true,
                carbs: true,
                fat: true,
                categoria: {
                    select: {
                        id: true,
                        nameES: true,
                        nameEN: true
                    }
                },
                // Explicitly excluding medidaId by NOT listing it
                medida: {
                    select: {
                        id: true,
                        nameES: true,
                        nameEN: true,
                        abreviation: true
                    }
                }
            }
        });
        return cachedData;
    }
    static async fetchFoodsByFdcIds(fdcIds) {
        return await prisma.comida.findMany({
            where: {
                FDCID: { in: fdcIds }
            },
        });
    }
    static async calculateNutrients(input) {
        if (input.length === 0) {
            return { items: [], totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } };
        }
        const fdcIds = input.map(item => item.fdcId);
        const foods = await this.fetchFoodsByFdcIds(fdcIds);
        const foodMap = new Map(foods.map(f => [f.FDCID, f]));
        const items = [];
        const nutritionList = [];
        for (const { fdcId, amount } of input) {
            const food = foodMap.get(fdcId);
            if (!food)
                continue;
            const nutrition = CaloriesService.calculateItemNutrition(food, amount);
            items.push({
                fdcId: food.FDCID,
                names: {
                    en: food.nameEN,
                    es: food.nameES,
                },
                nutrition,
                amount,
            });
            nutritionList.push(nutrition);
        }
        const totals = CaloriesService.calculateTotalNutrition(nutritionList);
        return { items, totals };
    }
    static async saveConsumption(input, userId) {
        const fdcIds = input.detalles.map(d => d.comidaId);
        const comidas = await prisma.comida.findMany({
            where: { FDCID: { in: fdcIds } },
            select: { id: true, FDCID: true }
        });
        const comidaIdMap = new Map(comidas.map(c => [c.FDCID, c.id]));
        const dataConsumo = await prisma.dataConsumo.create({
            data: {
                calorias_consumidas: input.calorias_consumidas,
                proteinas_consumidas: input.proteinas_consumidas,
                carbohidratos_consumidos: input.carbohidratos_consumidos,
                grasas_consumidas: input.grasas_consumidas,
                userId,
                detalles: {
                    create: input.detalles.map(detail => {
                        const internalComidaId = comidaIdMap.get(detail.comidaId);
                        if (!internalComidaId) {
                            throw new Error(`Comida with FDCID ${detail.comidaId} not found`);
                        }
                        return {
                            comidaId: internalComidaId,
                            cantidad_consumida: detail.cantidad_consumida,
                            calorias_consumida: detail.calorias_consumida,
                            proteinas_consumidas: detail.proteinas_consumida,
                            carbohidratos_consumidos: detail.carbohidratos_consumida,
                            grasas_consumidas: detail.grasas_consumida,
                        };
                    })
                }
            },
            include: {
                detalles: true
            }
        });
        return {
            id: dataConsumo.id,
            calorias_consumidas: dataConsumo.calorias_consumidas,
            grasas_consumidas: dataConsumo.grasas_consumidas,
            proteinas_consumidas: dataConsumo.proteinas_consumidas,
            carbohidratos_consumidos: dataConsumo.carbohidratos_consumidos,
            timestamp: dataConsumo.timestamp.toISOString(),
            userId: dataConsumo.userId,
            detalles: dataConsumo.detalles.map(d => ({
                id: d.id,
                comidaId: d.comidaId,
                cantidad_consumida: d.cantidad_consumida,
                calorias_consumida: d.calorias_consumida,
                grasas_consumidas: d.grasas_consumidas,
                proteinas_consumidas: d.proteinas_consumidas,
                carbohidratos_consumidos: d.carbohidratos_consumidos,
                dataConsumoId: d.dataConsumoId,
            })),
        };
    }
    static async getComidas(page = 1, limit = 50, search = "") {
        const skip = (page - 1) * limit;
        const where = search ? {
            OR: [
                { nameES: { contains: search, mode: 'insensitive' } },
                { nameEN: { contains: search, mode: 'insensitive' } }
            ]
        } : {};
        const [items, total] = await Promise.all([
            prisma.comida.findMany({
                where,
                skip,
                take: limit,
                include: { categoria: true, medida: true },
                orderBy: { id: 'desc' }
            }),
            prisma.comida.count({ where })
        ]);
        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    static async createComida(data) {
        return await prisma.comida.create({ data });
    }
    static async updateComida(id, data) {
        return await prisma.comida.update({ where: { id }, data });
    }
    static async deleteComida(id) {
        return await prisma.comida.delete({ where: { id } });
    }
    static async getConsumptions(userId, page = 1, limit = 50, startDate, endDate) {
        const skip = (page - 1) * limit;
        const where = { userId };
        if (startDate || endDate) {
            where.timestamp = {};
            if (startDate)
                where.timestamp.gte = new Date(startDate);
            if (endDate)
                where.timestamp.lte = new Date(endDate);
        }
        const [items, total] = await Promise.all([
            prisma.dataConsumo.findMany({
                where,
                skip,
                take: limit,
                orderBy: { timestamp: 'desc' },
            }),
            prisma.dataConsumo.count({ where }),
        ]);
        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    static async deleteConsumption(id, userId) {
        return await prisma.dataConsumo.delete({
            where: { id, userId },
        });
    }
    static async getConsumptionDetail(id, userId) {
        return await prisma.dataConsumo.findUnique({
            where: { id, userId },
            include: {
                detalles: {
                    include: {
                        comida: {
                            select: {
                                id: true,
                                FDCID: true,
                                nameES: true,
                                nameEN: true,
                                medidaId: true,
                            },
                        },
                    },
                },
            },
        });
    }
}
//# sourceMappingURL=controllers.js.map