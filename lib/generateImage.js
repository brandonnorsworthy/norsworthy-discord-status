const { chromium } = require('playwright');
const path = require('path');
const { DASHBOARD_URL } = require('./config');

const OUTPUT_PATH = path.join(__dirname, '../public/status-card.png');
const URL = `${DASHBOARD_URL}/discord`;

async function generateImage() {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage'
    ]
  });
  const context = await browser.newContext({
    javaScriptEnabled: true,
    viewport: { width: 1400, height: 1260 },
  });

  const page = await context.newPage();


  page.on('requestfailed', request => {
    console.error('[page requestfailed]', request.url(), request.failure());
  });

  page.on('response', response => {
    if (!response.ok()) {
      console.warn(`[page response] Bad response: ${response.status()} ${response.url()}`);
    }
  });

  page.on('console', msg => console.log('[page console]', msg.text()));
  try {
    console.log(`[${new Date().toISOString()}] Loading status page...`);
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    console.log(`[${new Date().toISOString()}] Page loaded, waiting for content...`);

    await page.waitForSelector('body.ready', { timeout: 300000 });
    //wait 5 seconds for any animations to finish
    await page.waitForTimeout(5000);
    console.log(`[${new Date().toISOString()}] Page content:`, await page.content());
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
