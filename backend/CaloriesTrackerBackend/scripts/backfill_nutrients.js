import { prisma } from '../prisma/lib/prisma.js';
import foodinfoClient from '../nodeApp/apis/foodApi/api.js';
function extractNutrients(food) {
    let calories = null;
    let protein = null;
    let carbs = null;
    let fat = null;
    const nutrients = food.foodNutrients || [];
    for (const n of nutrients) {
        const id = n.nutrient?.id || n.nutrientId;
        const name = (n.nutrient?.name || n.nutrientName || '').toLowerCase();
        const value = n.amount !== undefined ? n.amount : n.value;
        if (value === undefined || value === null)
            continue;
        // USDA Nutrient IDs:
        // 1008: Energy (kcal)
        // 1003: Protein (g)
        // 1005: Carbohydrate, by difference (g)
        // 1004: Total lipid (fat) (g)
        if (id === 1008 || name.includes('energy') || name === 'calories') {
            calories = value;
        }
        else if (id === 1003 || name.includes('protein')) {
            protein = value;
        }
        else if (id === 1005 || name.includes('carbohydrate')) {
            carbs = value;
        }
        else if (id === 1004 || name.includes('total lipid') || name === 'fat') {
            fat = value;
        }
    }
    return { calories, protein, carbs, fat };
}
async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function main() {
    console.log('--- Phase 1: Cleaning Duplicate FDCIDs ---');
    const allFoods = await prisma.comida.findMany();
    const seenFdcIds = new Set();
    const duplicateIds = [];
    for (const food of allFoods) {
        if (seenFdcIds.has(food.FDCID)) {
            duplicateIds.push(food.id);
        }
        else {
            seenFdcIds.add(food.FDCID);
        }
    }
    if (duplicateIds.length > 0) {
        console.log(`Found ${duplicateIds.length} duplicate food records. Deleting duplicate records...`);
        const deleteResult = await prisma.comida.deleteMany({
            where: {
                id: { in: duplicateIds }
            }
        });
        console.log(`Successfully deleted ${deleteResult.count} duplicate records.`);
    }
    else {
        console.log('No duplicate FDCIDs found.');
    }
    console.log('\n--- Phase 2: Fetching Nutrients from USDA API ---');
    // Get all foods where nutrients are not fully populated
    const pendingFoods = await prisma.comida.findMany({
        where: {
            OR: [
                { calories: null },
                { protein: null },
                { carbs: null },
                { fat: null }
            ]
        }
    });
    console.log(`Found ${pendingFoods.length} foods needing nutrient updates.`);
    if (pendingFoods.length === 0) {
        console.log('All foods are already up to date!');
        return;
    }
    const BATCH_SIZE = 20;
    for (let i = 0; i < pendingFoods.length; i += BATCH_SIZE) {
        const batch = pendingFoods.slice(i, i + BATCH_SIZE);
        const fdcIds = batch.map(f => f.FDCID);
        console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(pendingFoods.length / BATCH_SIZE)} (FDCIDs: ${fdcIds.join(', ')})`);
        try {
            // Fetch details in bulk from USDA
            const response = await foodinfoClient.post('/v1/foods', {
                fdcIds: fdcIds
            });
            const usdaFoods = response.data;
            if (Array.isArray(usdaFoods)) {
                for (const usdaFood of usdaFoods) {
                    const nutrients = extractNutrients(usdaFood);
                    const fdcId = usdaFood.fdcId;
                    // Find matching foods in our database
                    const localFood = batch.find(f => f.FDCID === fdcId);
                    if (localFood) {
                        await prisma.comida.updateMany({
                            where: { FDCID: fdcId },
                            data: {
                                calories: nutrients.calories,
                                protein: nutrients.protein,
                                carbs: nutrients.carbs,
                                fat: nutrients.fat
                            }
                        });
                        console.log(`Updated "${localFood.nameEN}" (FDCID: ${fdcId}): Cal: ${nutrients.calories}, P: ${nutrients.protein}, C: ${nutrients.carbs}, F: ${nutrients.fat}`);
                    }
                }
            }
            else {
                console.warn('USDA response was not an array', usdaFoods);
            }
        }
        catch (error) {
            console.error(`Failed to process batch starting at index ${i}:`, error.message || error);
        }
        // Small delay to prevent hitting API rate limit too quickly
        await sleep(1000);
    }
    console.log('\nNutrient backfill complete!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=backfill_nutrients.js.map