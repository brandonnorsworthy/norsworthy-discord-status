import { chromium } from 'playwright';
import path from 'path';
import { DASHBOARD_URL, IMAGE_GEN_LOGS } from './config';
import { chartTimeScales } from './chartTimeScales';
import fs, { stat } from 'fs';
import { AppState } from '../types/AppState';
import { logWithTime } from './logWithTime';

const IMAGE_PATH_A = path.join(__dirname, '../../public/status-card-a.png');
const IMAGE_PATH_B = path.join(__dirname, '../../public/status-card-b.png');

export async function generateImage(state: AppState): Promise<void> {
  const nextImage = state.currentImage === 'a' ? 'b' : 'a';
  const OUTPUT_PATH = nextImage === 'a' ? IMAGE_PATH_A : IMAGE_PATH_B;

  const currentScale = chartTimeScales[state.currentTimeViewIndex];

  const queryParams = new URLSearchParams({
    timescale: JSON.stringify(currentScale.query),
    title: currentScale.title
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
    viewport: { width: 1800, height: 840 }
  });

  const page = await context.newPage();

  if (IMAGE_GEN_LOGS) {
    page.on('requestfailed', request => logWithTime(`[page requestfailed] ${request.url()} - ${request.failure()?.errorText || 'Unknown error'}`));
    page.on('response', response => {
      if (!response.ok()) {
        logWithTime(`[page response] Bad response: ${response.status()} ${response.url()}`);
      }
    });
    page.on('console', msg => logWithTime(`[page console] ${msg.text()}`));
  }

  try {
    IMAGE_GEN_LOGS && logWithTime(`Loading status page: ${URL}`);
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    IMAGE_GEN_LOGS && logWithTime(`Page loaded, waiting for content...`);
    await page.waitForSelector('body.ready', { timeout: 300000 });
    await page.waitForTimeout(2500);

    IMAGE_GEN_LOGS && logWithTime(`Page content: ${JSON.stringify(await page.content())}`);
    IMAGE_GEN_LOGS && logWithTime(`Taking screenshot...`);

    await page.screenshot({ path: OUTPUT_PATH });

    logWithTime(`Status image saved`);

    // update state
    state.currentImage = nextImage;
    state.imageLastGenerated = Date.now();
    state.regenerate = false;
    state.currentTimeViewIndex = (state.currentTimeViewIndex + 1) % chartTimeScales.length;
  } catch (err: any) {
    logWithTime(`❌ Failed to render status card: ${err.message}`);
  } finally {
    await browser.close();
  }
}
