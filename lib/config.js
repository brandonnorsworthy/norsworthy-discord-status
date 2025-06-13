require('dotenv').config();

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;
const HOST_DOMAIN = process.env.HOST_DOMAIN;
const PORT = process.env.PORT;
const STATUS_API_URL = process.env.STATUS_API_URL;
const DASHBOARD_URL = process.env.DASHBOARD_URL;

module.exports = {
  DISCORD_WEBHOOK,
  HOST_DOMAIN,
  PORT,
  STATUS_API_URL,
  DASHBOARD_URL
};
