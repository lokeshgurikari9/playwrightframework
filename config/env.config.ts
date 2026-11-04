import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const env = {
  BASE_URL: process.env.BASE_URL || 'https://reqres.in',
  API_KEY: process.env.API_KEY || '',
  AUTH_TOKEN: process.env.AUTH_TOKEN || '',
};
