const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { DASHBOARD_URL } = require('./config');

const OUTPUT_PATH = path.join(__dirname, '../public/status-card.png');
const URL = `${DASHBOARD_URL}/discord`;
let isGenerating = false;

async function generateImage() {
  if (isGenerating) {
    console.log(`[${new Date().toISOString()}] Image generation already in progress, skipping...`);
    return;
  };
  isGenerating = true;

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
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.waitForSelector('body.docker-ready', { timeout: 30000 });

    console.log(`[${new Date().toISOString()}] Taking screenshot...`);
    await page.screenshot({ path: OUTPUT_PATH });

    console.log(`[${new Date().toISOString()}] Status image saved`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ Failed to render status card:`, err.message);
  } finally {
    await browser.close();
    isGenerating = false;
  }
}

module.exports = { generateImage };
