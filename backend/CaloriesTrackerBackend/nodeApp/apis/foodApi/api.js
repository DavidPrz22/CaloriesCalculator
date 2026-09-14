// DOCS : https://app.swaggerhub.com/apis/fdcnal/food-data_central_api/1.0.1
import axios from 'axios';
import { loadEnvFile } from 'node:process';
export const FOODENDPOINT = 'https://api.nal.usda.gov/fdc';
loadEnvFile();
const foodauth = process.env.USDAKEY;
const MAINFOODENDPOINTS = ['/v1/food/{fdcId}', "/v1/foods", ""];
const foodinfoClient = axios.create({
    baseURL: FOODENDPOINT,
    headers: {
        'Content-Type': 'application/json',
    },
    params: {
        api_key: foodauth,
    }
});
export default foodinfoClient;
//# sourceMappingURL=api.js.map