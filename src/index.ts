import express, { Request, Response, NextFunction } from 'express';
import { PORT } from './lib/config';
import router from './routes';
import updateDiscordStatus from './jobs/updateDiscordStatus';
import { AppState } from './types/AppState';

const app = express();
const serverPort = PORT || 3000;

const state: AppState = {
  currentImage: 'a',
  isGenerating: false,
  regenerate: true,
  currentTimeViewIndex: 0,
  imageLastGenerated: Math.floor(Date.now() / 1000),
};

// Middleware: block non-GET requests or invalid paths
app.use(<express.RequestHandler>((req, res, next) => {
  if (req.method !== 'GET' || (req.path !== '/status-card.png' && req.path !== '/')) {
    return res.status(403).send('Forbidden');
  }
  next();
}));

// Logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/', router(state));

app.listen(serverPort, () => {
  console.log(`Server listening on http://localhost:${serverPort}`);
});

// Update Discord message image every minute
const updateInterval = setInterval(() => updateDiscordStatus(state), 60 * 1000);
updateDiscordStatus(state);

// Graceful shutdown
const cleanup = async () => {
  clearInterval(updateInterval);
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
