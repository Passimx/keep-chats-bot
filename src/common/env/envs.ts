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
    archiverApiKey: String(process.env.TELEGRAM_ARCHIVER_APIKEY),
    archiverEndpoint: String(process.env.TELEGRAM_ARCHIVER_ENDPOINT),
  },
};
