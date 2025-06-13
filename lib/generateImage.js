const { chromium } = require('playwright');
const path = require('path');
const { DASHBOARD_URL } = require('./config');

const OUTPUT_PATH = path.join(__dirname, '../public/status-card.png');
const URL = `${DASHBOARD_URL}/discord`;

async function generateImage() {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();

  try {
    console.log(`[${new Date().toISOString()}] Loading status page...`);
    await page.goto(URL, { waitUntil: 'networkidle' });

    console.log(`[${new Date().toISOString()}] Page loaded, waiting for content...`);
    console.log('log1', await page.content());
    await page.waitForSelector('body');
    console.log('log2', await page.content());

    console.log(`[${new Date().toISOString()}] Taking screenshot...`);
    await page.screenshot({ path: OUTPUT_PATH });

    console.log(`[${new Date().toISOString()}] Status image saved`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ Failed to render status card:`, err.message);
  } finally {
    await browser.close();
  }
}

module.exports = { generateImage };
