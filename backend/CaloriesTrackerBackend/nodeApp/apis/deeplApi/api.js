// https://developers.deepl.com/docs/getting-started/quickstart <=== DOCs
import axios from 'axios';
import { loadEnvFile } from 'node:process';
export const DEEPLENDPOINT = 'https://api-free.deepl.com';

try {
  loadEnvFile();
} catch (e) {}

const authkey = process.env.DeepLKey;

const deeplClient = axios.create({
  baseURL: DEEPLENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `DeepL-Auth-Key ${authkey}`,
  },
});

export default deeplClient;
