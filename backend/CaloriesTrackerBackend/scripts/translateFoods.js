import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import deeplClient from "../nodeApp/apis/deeplApi/api.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TRANSLATION_DELAY_MS = 100;
const TARGET_LANG = "ES";
const SOURCE_LANG = "EN";
const FOODS_FDC_DIR = resolve(__dirname, "../../../foods_fdc");
async function translateName(name) {
    if (!name || !name.trim()) {
        return name;
    }
    const cleanedName = name.trim();
    try {
        const response = await deeplClient.post("/v2/translate", {
            text: [cleanedName],
            source_lang: SOURCE_LANG,
            target_lang: TARGET_LANG,
        });
        const translatedText = response.data?.translations?.[0]?.text;
        return translatedText || cleanedName;
    }
    catch (error) {
        const err = error;
        if (err.response?.status === 429) {
            console.log("    Rate limited, waiting 1 second...");
            await new Promise((r) => setTimeout(r, 1000));
            return translateName(name);
        }
        console.warn(`    Warning: Failed to translate "${cleanedName.substring(0, 50)}":`, error);
        return cleanedName;
    }
}
function processCsvFile(filepath) {
    return new Promise((resolve, reject) => {
        const filename = filepath.split("/").pop() || filepath;
        console.log(`\nProcessing: ${filename}`);
        let fileContent;
        try {
            fileContent = readFileSync(filepath, "utf-8");
        }
        catch (error) {
            console.error(`  Error reading file: ${error}`);
            reject(error);
            return;
        }
        const lines = fileContent.split("\n");
        if (lines.length < 2) {
            console.log("  Skipping: empty file or header only");
            resolve();
            return;
        }
        const headerLine = lines[0];
        const headerFields = parseCSVLine(headerLine);
        if (headerFields.includes("nameES")) {
            console.log("  Skipping: nameES column already exists");
            resolve();
            return;
        }
        const nameIndex = headerFields.indexOf("name");
        if (nameIndex === -1) {
            console.error("  Error: 'name' column not found in CSV");
            reject(new Error("Missing 'name' column"));
            return;
        }
        headerFields.splice(nameIndex + 1, 0, "nameES");
        const newHeader = headerFields.join(",");
        const dataRows = lines.slice(1).filter((line) => line.trim());
        console.log(`  Found ${dataRows.length} rows to translate`);
        let processedCount = 0;
        const translatedRows = [];
        async function processRows() {
            for (const row of dataRows) {
                const { fields, wasQuoted } = parseCSVLineWithRaw(row);
                const originalName = fields[nameIndex] || "";
                const translatedName = await translateName(originalName);
                const quotedTranslation = csvQuote(translatedName);
                fields.splice(nameIndex + 1, 0, quotedTranslation);
                wasQuoted.splice(nameIndex + 1, 0, false);
                const outputFields = fields.map((f, i) => wasQuoted[i] ? `"${f.replace(/"/g, '""')}"` : f);
                translatedRows.push(outputFields.join(","));
                processedCount++;
                if (processedCount % 10 === 0 || processedCount === dataRows.length) {
                    console.log(`  Translated ${processedCount}/${dataRows.length}...`);
                }
                await new Promise((r) => setTimeout(r, TRANSLATION_DELAY_MS));
            }
            const newContent = [newHeader, ...translatedRows].join("\n");
            try {
                writeFileSync(filepath, newContent, "utf-8");
                console.log(`  Done! Added nameES to ${processedCount} rows`);
            }
            catch (error) {
                console.error(`  Error writing file: ${error}`);
                reject(error);
                return;
            }
            resolve();
        }
        processRows();
    });
}
function csvQuote(value) {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}
function parseCSVLine(line) {
    const fields = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            }
            else {
                inQuotes = !inQuotes;
            }
        }
        else if (char === "," && !inQuotes) {
            fields.push(current.trim());
            current = "";
        }
        else {
            current += char;
        }
    }
    fields.push(current.trim());
    return fields;
}
function parseCSVLineWithRaw(line) {
    const fields = [];
    const wasQuoted = [];
    let current = "";
    let inQuotes = false;
    let fieldStartQuoted = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            }
            else {
                inQuotes = !inQuotes;
                if (inQuotes)
                    fieldStartQuoted = true;
            }
        }
        else if (char === "," && !inQuotes) {
            fields.push(current);
            wasQuoted.push(fieldStartQuoted);
            current = "";
            fieldStartQuoted = false;
        }
        else {
            current += char;
        }
    }
    fields.push(current);
    wasQuoted.push(fieldStartQuoted);
    return { fields, wasQuoted };
}
async function main() {
    const { values } = parseArgs({
        options: {
            file: {
                type: "string",
                multiple: true,
            },
        },
    });
    const foodsDir = FOODS_FDC_DIR;
    let filesToProcess = [];
    if (values.file && Array.isArray(values.file) && values.file.length > 0) {
        filesToProcess = values.file.map((f) => {
            if (f.endsWith(".csv")) {
                return join(foodsDir, f);
            }
            return join(foodsDir, `${f}.csv`);
        });
    }
    else {
        const allFiles = readdirSync(foodsDir).filter((f) => f.endsWith(".csv"));
        filesToProcess = allFiles.map((f) => join(foodsDir, f));
    }
    if (filesToProcess.length === 0) {
        console.log("No CSV files found to process");
        return;
    }
    console.log(`Found ${filesToProcess.length} file(s) to process`);
    for (const filepath of filesToProcess) {
        try {
            await processCsvFile(filepath);
        }
        catch (error) {
            console.error(`Error processing ${filepath}:`, error);
        }
    }
    console.log("\nAll files processed!");
}
main().catch(console.error);
//# sourceMappingURL=translateFoods.js.map