import { prisma } from '../lib/prisma';
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
async function main() {
    console.log('Starting to populate Categoria table...');
    for (const cat of categorias) {
        await prisma.categoria.create({
            data: cat,
        });
        console.log(`Created categoria: ${cat.nameES} / ${cat.nameEN}`);
    }
    console.log('Categoria table populated successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=populateCategorias.js.map