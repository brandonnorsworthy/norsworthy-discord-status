require('dotenv').config();

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;
const HOST_DOMAIN = process.env.HOST_DOMAIN;
const PORT = process.env.PORT;
const DASHBOARD_URL = process.env.DASHBOARD_URL;
const IMAGE_GEN_LOGS = process.env.IMAGE_GEN_LOGS === 'true';

module.exports = {
  DISCORD_WEBHOOK,
  HOST_DOMAIN,
  PORT,
  DASHBOARD_URL,
  IMAGE_GEN_LOGS
};
