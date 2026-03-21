import * as process from 'process';
import { config } from 'dotenv';

config();

export const Envs = {
  database: {
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
  },
  telegram: {
    botToken: String(process.env.TELEGRAM_BOT_TOKEN),
  },

  archiver: {
    apiKey: String(process.env.ARCHIVER_APIKEY),
    endpoint: String(process.env.ARCHIVER_ENDPOINT),
  },
};
