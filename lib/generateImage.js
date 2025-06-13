const { chromium } = require('playwright');
const path = require('path');
const { DASHBOARD_URL } = require('./config');

const OUTPUT_PATH = path.join(__dirname, '../public/status-card.png');
const URL = `${DASHBOARD_URL}/discord`;

async function generateImage() {
  const browser = await chromium.launch({
    headless: true,
  });
  const context = await browser.newContext({
    javaScriptEnabled: true,
  });

  const page = await context.newPage();

  try {
    console.log(`[${new Date().toISOString()}] Loading status page...`);
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await new Promise((resolve) => setTimeout(resolve, 60000)); // wait for 60 seconds

    page.on('requestfailed', request => {
      console.error('\n\n:requestfailed:', request.url(), request.failure());
    });

    page.on('response', response => {
      if (!response.ok()) {
        console.warn(`\n\nresponse: Bad response: ${response.status()} ${response.url()}`);
      }
    });
    console.log(`\n\n[${new Date().toISOString()}] Page loaded, waiting for content...`);
    page.on('\n\nconsole', msg => console.log('[page console]', msg.text()));
    console.log('\n\npage content:', await page.content());

    await page.waitForSelector('body');

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
