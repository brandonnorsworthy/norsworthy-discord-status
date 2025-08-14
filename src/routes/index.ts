import express, { Request, Response, Router } from 'express';
import fs from 'fs';
import path from 'path';
import { generateImage } from '../lib/generateImage';
import { AppState } from '../types/AppState';
import { logWithTime } from '../lib/logWithTime';
import { IMAGE_GEN_LOGS } from '../lib/config';

const IMAGE_PATH_A = path.join(__dirname, '../../public/status-card-a.png');
const IMAGE_PATH_B = path.join(__dirname, '../../public/status-card-b.png');
const PLACEHOLDER_PATH = path.join(__dirname, '../../public/placeholder.png');

const FIFTHTEEN_MINUTES = 60 * 1000;

export default (state: AppState): Router => {
  const router = express.Router();

  router.get('/status-card.png', async (_req: Request, res: Response) => {
    try {
      const now = Date.now();
      const age = now - state.imageLastGenerated;

      IMAGE_GEN_LOGS && logWithTime(`Will Generate Image: ${age > FIFTHTEEN_MINUTES && !state.isGenerating}`)
      // Kick off new generation if older than 15 minutes and not already generating
      if (age > FIFTHTEEN_MINUTES && !state.isGenerating) {
        state.isGenerating = true;

        state.generationPromise = (async () => {
          try {
            await generateImage(state);
          } catch (error) {
            logWithTime('Error generating image', error as Error);
          } finally {
            state.isGenerating = false;
            state.generationPromise = undefined;
          }
        })();
      }

      // Serve the current READY image
      const fileToSend =
        state.currentImage === 'a'
          ? fs.existsSync(IMAGE_PATH_A)
            ? IMAGE_PATH_A
            : PLACEHOLDER_PATH
          : fs.existsSync(IMAGE_PATH_B)
            ? IMAGE_PATH_B
            : PLACEHOLDER_PATH;

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'no-store');
      res.sendFile(fileToSend);
    } catch (err) {
      logWithTime('Error serving image', err as Error);
      res.status(500).send('Server error');
    }
  });

  router.get('/', (_req: Request, res: Response) => {
    res.sendStatus(403);
  });

  return router;
};
