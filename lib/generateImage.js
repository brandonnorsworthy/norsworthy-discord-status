const { chromium } = require('playwright');
const path = require('path');
const { DASHBOARD_URL, IMAGE_GEN_LOGS } = require('./config');
const { chartTimeScales } = require('./chartTimeScales');

const OUTPUT_PATH = path.join(__dirname, '../public/status-card.png');

async function generateImage(state) {
  const queryParams = new URLSearchParams({
    timescale: JSON.stringify(chartTimeScales[state.currentTimeViewIndex].query),
    title: chartTimeScales[state.currentTimeViewIndex].title
  });

  const queryString = `?${queryParams.toString()}`;
  const URL = `${DASHBOARD_URL}/discord${queryString}`;

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
    viewport: { width: 1800, height: 840 },
  });

  const page = await context.newPage();

  if (IMAGE_GEN_LOGS) {
    page.on('requestfailed', request => console.error('[page requestfailed]', request.url(), request.failure()));
    page.on('response', response => {
      if (!response.ok()) {
        console.warn(`[page response] Bad response: ${response.status()} ${response.url()}`);
      }
    });
    page.on('console', msg => console.log('[page console]', msg.text()));
  }

  try {
    IMAGE_GEN_LOGS && console.log(`[${new Date().toISOString()}] Loading status page. ${URL}`);
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    IMAGE_GEN_LOGS && console.log(`[${new Date().toISOString()}] Page loaded, waiting for content...`);

    await page.waitForSelector('body.ready', { timeout: 300000 });
    //wait 2.5 seconds for any animations to finish
    await page.waitForTimeout(2500);
    IMAGE_GEN_LOGS && console.log(`[${new Date().toISOString()}] Page content:`, await page.content());
    IMAGE_GEN_LOGS && console.log(`[${new Date().toISOString()}] Taking screenshot...`);

    await page.screenshot({ path: OUTPUT_PATH });
    console.log(`[${new Date().toISOString()}] Status image saved`);

    // update state
    state.regenerate = false;
    state.imageLastGenerated = Math.floor(Date.now() / 1000);
    state.currentTimeViewIndex = (state.currentTimeViewIndex + 1) % chartTimeScales.length;
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ Failed to render status card:`, err.message);
  } finally {
    await browser.close();
  }
}

module.exports = { generateImage };
