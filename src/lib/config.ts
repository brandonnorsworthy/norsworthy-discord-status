import dotenv from 'dotenv';
dotenv.config();

export const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK ?? '';
export const HOST_DOMAIN = process.env.HOST_DOMAIN ?? '';
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
export const DASHBOARD_URL = process.env.DASHBOARD_URL ?? '';
export const IMAGE_GEN_LOGS = process.env.IMAGE_GEN_LOGS === 'true';
