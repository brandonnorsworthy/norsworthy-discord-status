require('dotenv').config();

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;
const HOST_DOMAIN = process.env.HOST_DOMAIN;
const PORT = process.env.PORT;
const DASHBOARD_URL = process.env.DASHBOARD_URL;

module.exports = {
  DISCORD_WEBHOOK,
  HOST_DOMAIN,
  PORT,
  DASHBOARD_URL
};
