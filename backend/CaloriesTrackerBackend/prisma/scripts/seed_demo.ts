import { prisma } from '../lib/prisma.js';
import foodinfoClient from '../../nodeApp/apis/foodApi/api.js';
import bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

const CSV_DIR = process.env.FOOD_DATA_PATH || '/home/davidprz/projects/CaloriesTracker/food_data/foods_fdc';

const categorias = [
  { nameES: 'Todas las categorías', nameEN: 'All categories' },
  { nameES: 'Productos horneados', nameEN: 'Baked products' },
  { nameES: 'Productos de carne de res', nameEN: 'Beef products' },
  { nameES: 'Bebidas', nameEN: 'Beverages' },
  { nameES: 'Cereales y pastas', nameEN: 'Cereals and pasta' },
  { nameES: 'Productos lácteos', nameEN: 'Dairy' },
  { nameES: 'Huevos', nameEN: 'Eggs' },
  { nameES: 'Grasas y aceites', nameEN: 'Fats and oils' },
  { nameES: 'Pescados y mariscos', nameEN: 'Fish and seafood' },
  { nameES: 'Frutas y jugos de frutas', nameEN: 'Fruits and fruit juices' },
  { nameES: 'Productos de cordero, ternera y caza', nameEN: 'Lamb, veal and game products' },
  { nameES: 'Legumbres y productos de legumbres', nameEN: 'Legumes and legume products' },
  { nameES: 'Productos de nueces y semillas', nameEN: 'Nut and seed products' },
  { nameES: 'Carnes', nameEN: 'Meats' },
  { nameES: 'Productos de aves de corral', nameEN: 'Poultry products' },
  { nameES: 'Alimentos de restaurante', nameEN: 'Restaurant foods' },
  { nameES: 'Embutidos y carnes frías', nameEN: 'Sausages and luncheon meats' },
  { nameES: 'Sopas, salsas y jugos de carne', nameEN: 'Soups, sauces and meat juices' },
  { nameES: 'Especias y hierbas', nameEN: 'Spices and herbs' },
  { nameES: 'Dulces', nameEN: 'Snacks' },
  { nameES: 'Verduras y productos vegetales', nameEN: 'Vegetables' },
];

const medidas = [
  { nameES: 'Gramos', nameEN: 'Grams', abreviation: 'g' },
  { nameES: 'Mililitros', nameEN: 'Milliliters', abreviation: 'ml' },
  { nameES: 'Taza', nameEN: 'Cup', abreviation: 'cup' },
  { nameES: 'Unidad', nameEN: 'Piece', abreviation: 'pc' },
  { nameES: 'Cucharada', nameEN: 'Tablespoon', abreviation: 'tbsp' },
  { nameES: 'Cucharadita', nameEN: 'Teaspoon', abreviation: 'tsp' },
  { nameES: 'Onza', nameEN: 'Ounce', abreviation: 'oz' },
  { nameES: 'Libra', nameEN: 'Pound', abreviation: 'lb' },
  { nameES: 'Kilogramo', nameEN: 'Kilogram', abreviation: 'kg' },
  { nameES: 'Litro', nameEN: 'Liter', abreviation: 'L' },
  { nameES: 'Porción', nameEN: 'Serving', abreviation: 'srv' },
  { nameES: '100 gramos', nameEN: '100 grams', abreviation: '100g' },
  { nameES: '100 mililitros', nameEN: '100 milliliters', abreviation: '100ml' },
];

const csvFiles = [
  'beverages.csv',
  'cereals_and_grains.csv',
  'condiments_and_spices.csv',
  'dairy.csv',
  'eggs.csv',
  'fats_and_oils.csv',
  'fish_and_seafood.csv',
  'fruits_fdc.csv',
  'legumes.csv',
  'meats.csv',
  'nuts_and_seeds.csv',
  'snacks_fdc.csv',
  'vegetables.csv',
];

const DEMO_USER = {
  username: 'demo@caloriestracker.com',
  password: 'demo1234',
};

interface ComidaRow {
  id: string;
  name: string;
  nameES: string;
  categoriaId: string;
  medidaId: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function readCSV(filename: string): ComidaRow[] {
  const filePath = path.join(CSV_DIR, filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const firstLine = lines[0];
  if (!firstLine) return [];
  const headers = firstLine.split(',');

  const rows: ComidaRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const values = parseCSVLine(line);
    const row: any = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim().replace(/^"|"$/g, '') || '';
    });
    rows.push(row as ComidaRow);
  }
  return rows;
}

function extractNutrients(food: any) {
  let calories: number | null = null;
  let protein: number | null = null;
  let carbs: number | null = null;
  let fat: number | null = null;

  const nutrients = food.foodNutrients || [];
  for (const n of nutrients) {
    const id = n.nutrient?.id || n.nutrientId;
    const name = (n.nutrient?.name || n.nutrientName || '').toLowerCase();
    const value = n.amount !== undefined ? n.amount : n.value;

    if (value === undefined || value === null) continue;

    if (id === 1008 || name.includes('energy') || name === 'calories') {
      calories = value;
    } else if (id === 1003 || name.includes('protein')) {
      protein = value;
    } else if (id === 1005 || name.includes('carbohydrate')) {
      carbs = value;
    } else if (id === 1004 || name.includes('total lipid') || name === 'fat') {
      fat = value;
    }
  }

  return { calories, protein, carbs, fat };
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function seedCategorias() {
  console.log('\n--- Seeding Categorias ---');
  const existingCount = await prisma.categoria.count();
  if (existingCount >= categorias.length) {
    console.log(`Categorias already seeded (${existingCount} found).`);
    return;
  }

  for (const cat of categorias) {
    await prisma.categoria.upsert({
      where: { id: categorias.indexOf(cat) + 1 },
      update: {},
      create: cat,
    });
  }
  console.log(`Created ${categorias.length} categorias.`);
}

async function seedMedidas() {
  console.log('\n--- Seeding Medidas ---');
  const existingCount = await prisma.medida.count();
  if (existingCount >= medidas.length) {
    console.log(`Medidas already seeded (${existingCount} found).`);
    return;
  }

  for (let i = 0; i < medidas.length; i++) {
    const medida = medidas[i];
    if (!medida) continue;
    await prisma.medida.upsert({
      where: { id: i + 1 },
      update: {},
      create: {
        id: i + 1,
        nameES: medida.nameES,
        nameEN: medida.nameEN,
        abreviation: medida.abreviation,
      },
    });
  }
  console.log(`Created ${medidas.length} medidas.`);
}

async function seedFoods() {
  console.log('\n--- Seeding Foods from CSV ---');
  const existingCount = await prisma.comida.count();
  if (existingCount > 100) {
    console.log(`Foods already seeded (${existingCount} found).`);
    return;
  }

  if (!fs.existsSync(CSV_DIR)) {
    console.log(`CSV directory not found: ${CSV_DIR}`);
    console.log('Skipping food seeding. Run locally to populate food data.');
    return;
  }

  let totalCreated = 0;

  for (const file of csvFiles) {
    const filePath = path.join(CSV_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${file} (not found)`);
      continue;
    }
    console.log(`Processing ${file}...`);
    const rows = readCSV(file);

    for (const row of rows) {
      const fdcId = parseInt(row.id, 10);
      const categoriaId = parseInt(row.categoriaId, 10);
      const medidaId = parseInt(row.medidaId, 10);

      if (isNaN(fdcId) || isNaN(categoriaId) || isNaN(medidaId)) {
        continue;
      }

      await prisma.comida.upsert({
        where: { FDCID: fdcId },
        update: {},
        create: {
          FDCID: fdcId,
          nameES: row.nameES,
          nameEN: row.name,
          categoriaId: categoriaId,
          medidaId: medidaId,
        },
      });
      totalCreated++;
    }
  }
  console.log(`Seeded ${totalCreated} foods.`);
}

async function backfillNutrients() {
  console.log('\n--- Backfilling Nutrients from USDA API ---');

  const pendingFoods = await prisma.comida.findMany({
    where: {
      OR: [
        { calories: null },
        { protein: null },
        { carbs: null },
        { fat: null },
      ],
    },
  });

  console.log(`Found ${pendingFoods.length} foods needing nutrient updates.`);
  if (pendingFoods.length === 0) {
    console.log('All foods have nutrients!');
    return;
  }

  const BATCH_SIZE = 20;
  for (let i = 0; i < pendingFoods.length; i += BATCH_SIZE) {
    const batch = pendingFoods.slice(i, i + BATCH_SIZE);
    const fdcIds = batch.map((f) => f.FDCID);

    console.log(
      `Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(pendingFoods.length / BATCH_SIZE)} (FDCIDs: ${fdcIds.join(', ')})`
    );

    try {
      const response = await foodinfoClient.post('/v1/foods', { fdcIds });
      const usdaFoods = response.data;

      if (Array.isArray(usdaFoods)) {
        for (const usdaFood of usdaFoods) {
          const nutrients = extractNutrients(usdaFood);
          const fdcId = usdaFood.fdcId;

          const localFood = batch.find((f) => f.FDCID === fdcId);
          if (localFood) {
            await prisma.comida.updateMany({
              where: { FDCID: fdcId },
              data: {
                calories: nutrients.calories,
                protein: nutrients.protein,
                carbs: nutrients.carbs,
                fat: nutrients.fat,
              },
            });
          }
        }
      }
    } catch (error: any) {
      console.error(`Failed to process batch:`, error.message || error);
    }

    await sleep(1000);
  }

  console.log('Nutrient backfill complete!');
}

async function seedDemoUser() {
  console.log('\n--- Seeding Demo User ---');

  const existingUser = await prisma.user.findUnique({
    where: { username: DEMO_USER.username },
  });

  if (existingUser) {
    console.log(`Demo user already exists (id: ${existingUser.id}).`);
    return existingUser.id;
  }

  const hashedPassword = await bcrypt.hash(DEMO_USER.password, 10);
  const user = await prisma.user.create({
    data: {
      username: DEMO_USER.username,
      password: hashedPassword,
    },
  });

  console.log(`Created demo user (id: ${user.id}).`);
  return user.id;
}

async function seedDemoConsumptions(userId: number) {
  console.log('\n--- Seeding Demo Consumption Records ---');

  const existingConsumptions = await prisma.dataConsumo.count({
    where: { userId },
  });

  if (existingConsumptions > 0) {
    console.log(`Demo user already has ${existingConsumptions} consumption records.`);
    return;
  }

  const foods = await prisma.comida.findMany({
    where: {
      calories: { not: null },
      protein: { not: null },
      carbs: { not: null },
      fat: { not: null },
    },
    take: 50,
  });

  if (foods.length < 10) {
    console.log('Not enough foods with nutrients to create demo consumptions.');
    return;
  }

  const foodMap = new Map(foods.map((f) => [f.FDCID, f]));

  const findFood = (nameEN: string) =>
    foods.find((f) => f.nameEN.toLowerCase().includes(nameEN.toLowerCase()));

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const meals = [
    {
      timestamp: new Date(today.getTime() + 8 * 60 * 60 * 1000),
      items: [
        { name: 'milk', amount: 250 },
        { name: 'oatmeal', amount: 40 },
        { name: 'banana', amount: 120 },
      ],
    },
    {
      timestamp: new Date(today.getTime() + 13 * 60 * 60 * 1000),
      items: [
        { name: 'chicken', amount: 150 },
        { name: 'rice', amount: 200 },
        { name: 'broccoli', amount: 100 },
      ],
    },
    {
      timestamp: new Date(today.getTime() + 16 * 60 * 60 * 1000),
      items: [
        { name: 'almond', amount: 30 },
        { name: 'apple', amount: 180 },
      ],
    },
    {
      timestamp: new Date(yesterday.getTime() + 9 * 60 * 60 * 1000),
      items: [
        { name: 'yogurt', amount: 200 },
        { name: 'granola', amount: 50 },
        { name: 'strawberry', amount: 150 },
      ],
    },
    {
      timestamp: new Date(yesterday.getTime() + 13 * 60 * 60 * 1000),
      items: [
        { name: 'salmon', amount: 150 },
        { name: 'potato', amount: 200 },
        { name: 'spinach', amount: 100 },
      ],
    },
    {
      timestamp: new Date(yesterday.getTime() + 19 * 60 * 60 * 1000),
      items: [
        { name: 'bread', amount: 60 },
        { name: 'cheese', amount: 30 },
        { name: 'tomato', amount: 100 },
      ],
    },
  ];

  for (const meal of meals) {
    const details: {
      comidaId: number;
      cantidad_consumida: number;
      calorias_consumida: number;
      proteinas_consumidas: number;
      carbohidratos_consumidos: number;
      grasas_consumidas: number;
    }[] = [];

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    for (const item of meal.items) {
      const food = findFood(item.name);
      if (!food || !food.calories || !food.protein || !food.carbs || !food.fat) continue;

      const calories = Math.round((food.calories * item.amount) / 100);
      const protein = Math.round((food.protein * item.amount) / 100);
      const carbs = Math.round((food.carbs * item.amount) / 100);
      const fat = Math.round((food.fat * item.amount) / 100);

      details.push({
        comidaId: food.id,
        cantidad_consumida: item.amount,
        calorias_consumida: calories,
        proteinas_consumidas: protein,
        carbohidratos_consumidos: carbs,
        grasas_consumidas: fat,
      });

      totalCalories += calories;
      totalProtein += protein;
      totalCarbs += carbs;
      totalFat += fat;
    }

    if (details.length === 0) continue;

    await prisma.dataConsumo.create({
      data: {
        userId,
        timestamp: meal.timestamp,
        calorias_consumidas: totalCalories,
        proteinas_consumidas: totalProtein,
        carbohidratos_consumidos: totalCarbs,
        grasas_consumidas: totalFat,
        detalles: { create: details },
      },
    });
  }

  console.log('Created demo consumption records.');
}

async function main() {
  console.log('=== Starting Demo Seed Script ===');

  await seedCategorias();
  await seedMedidas();
  await seedFoods();
  await backfillNutrients();
  const userId = await seedDemoUser();
  await seedDemoConsumptions(userId);

  console.log('\n=== Demo Seed Complete ===');
  console.log(`\nDemo credentials:`);
  console.log(`  Username: ${DEMO_USER.username}`);
  console.log(`  Password: ${DEMO_USER.password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
