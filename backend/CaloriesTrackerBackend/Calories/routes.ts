import { Router } from "express";
/// <reference path="../../nodeApp/types/express.d.ts" />
import { CaloriesFoodController } from "./controllers";
import { SearchFoodQuerySchema, calculateNutrientsArgs, SaveConsumptionInputSchema, CreateComidaSchema, UpdateComidaSchema, GetConsumptionsQuerySchema } from './zod'
import { ZodError }  from 'zod'

    export function getPublicCaloriesRoutes(): Router {
        const router = Router();

        router.get("/categories", async (req, res) => {
        const results = await CaloriesFoodController.retrieveFoodsCategories()
        res.status(200).json({"categories": results});
    })

        router.get("/units", async (req, res) => {
            const results = await CaloriesFoodController.retrieveFoodsMeasures()
            res.status(200).json({"units": results});
        })

        router.get('/comida', async (req, res) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;
            const search = (req.query.search as string) || "";
            const result = await CaloriesFoodController.getComidas(page, limit, search);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
        });

        router.get('/search-food', async (req, res) => {
            try {
                // 1. Validate and parse the runtime data
                const validatedQuery = SearchFoodQuerySchema.parse(req.query);
                
                // 2. Pass perfectly typed data to the controller
                const results = await CaloriesFoodController.searchFoodbyQuery(
                    validatedQuery.query, 
                    validatedQuery.lang,
                    validatedQuery.categoriaId, 
                );

                res.status(200).json({"foods": results});

            } catch (error) {
                if (error instanceof ZodError) {
                    res.status(400).json({ error: error });
                } else {
                    res.status(500).json({ error: "Internal Server Error" });
                }
            }
        });
        
        router.post('/calculate', async (req, res) => {
            try {
                const validatedBody = calculateNutrientsArgs.parse(req.body);
                const response = await CaloriesFoodController.calculateNutrients(validatedBody);
                res.status(200).json(response);
            } catch (error) {
                if (error instanceof ZodError) {
                    res.status(400).json({ error: error });
                } else {
                    res.status(500).json({ error: "Internal Server Error" });
                }
            }
        });
        return router;
    }

    export function getPrivateCaloriesRoutes(): Router {
        const router = Router()

        router.get('/consumptions', async (req, res) => {
        try {
            const validatedQuery = GetConsumptionsQuerySchema.parse(req.query);
            const result = await CaloriesFoodController.getConsumptions(
                validatedQuery.page,
                validatedQuery.limit,
                validatedQuery.startDate,
                validatedQuery.endDate,
            );
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ error: error });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    });

    router.delete('/consumptions/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
            await CaloriesFoodController.deleteConsumption(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    router.get('/consumptions/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
            const result = await CaloriesFoodController.getConsumptionDetail(id);
            if (!result) return res.status(404).json({ error: "Not found" });
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    router.post('/save-consumption', async (req, res) => {
        try {
            const userId = req.user!.id; // User is attached to req by JWT middleware
            const validatedBody = SaveConsumptionInputSchema.parse(req.body);
            const result = await CaloriesFoodController.saveConsumption(validatedBody, userId);
            res.status(201).json(result);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ error: error });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    })

     router.post('/comida', async (req, res) => {
            try {
                const validatedBody = CreateComidaSchema.parse(req.body);
                const result = await CaloriesFoodController.createComida(validatedBody);
                res.status(201).json(result);
            } catch (error) {
                if (error instanceof ZodError) {
                    res.status(400).json({ error: error });
                } else {
                    res.status(500).json({ error: "Internal Server Error" });
                }
            }
        });

        router.put('/comida/:id', async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
                const validatedBody = UpdateComidaSchema.parse(req.body);
                const result = await CaloriesFoodController.updateComida(id, validatedBody);
                res.status(200).json(result);
            } catch (error) {
                if (error instanceof ZodError) {
                    res.status(400).json({ error: error });
                } else {
                    res.status(500).json({ error: "Internal Server Error" });
                }
            }
        });

        router.delete('/comida/:id', async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
                await CaloriesFoodController.deleteComida(id);
                res.status(204).send();
            } catch (error) {
                res.status(500).json({ error: "Internal Server Error" });
            }
        });

    return router;
}

