import { prisma } from '../lib/prisma';
import * as fs from 'fs';
import * as path from 'path';
const MEDIDA_CSV = '/home/davidprz/projects/CaloriesTracker/backend/CaloriesTrackerBackend/prisma/schema/medidas.csv';
async function main() {
    console.log('Starting to populate Medida table...');
    const content = fs.readFileSync(MEDIDA_CSV, 'utf-8');
    const lines = content.trim().split('\n');
    for (let i = 1; i < lines.length; i++) {
        const [id, nameES, nameEN, abbreviation] = lines[i].split(',');
        await prisma.medida.create({
            data: {
                id: parseInt(id, 10),
                nameES: nameES.trim(),
                nameEN: nameEN.trim(),
                abreviation: abbreviation.trim(),
            },
        });
        console.log(`Created medida: ${nameES} (${abbreviation})`);
    }
    console.log('Medida table populated successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=populateMedida.js.map