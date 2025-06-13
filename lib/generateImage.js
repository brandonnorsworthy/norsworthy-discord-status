const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { DASHBOARD_URL } = require('./config');

const OUTPUT_PATH = path.join(__dirname, '../public/status-card.png');
const URL = `${DASHBOARD_URL}/discord`;

async function generateImage() {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true
  });

  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1260 });

  try {
    console.log(`[${new Date().toISOString()}] Loading status page...`);
    await page.goto(URL, {
      waitUntil: 'networkidle0',
      timeout: 15000,
    });

    const screenshot = await page.screenshot({ path: OUTPUT_PATH });

    console.log(`[${new Date().toISOString()}] Status image saved`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ Failed to render status card:`, err.message);
  } finally {
    await browser.close();
  }
}

module.exports = { generateImage };
