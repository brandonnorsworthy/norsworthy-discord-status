const express = require('express');
const { PORT } = require('./lib/config');
const router = require('./routes');
const updateDiscordStatus = require('./jobs/updateDiscordStatus');

const app = express();
const serverport = PORT || 3000;
const state = {
  isGenerating: false,
  regenerate: true,
  currentTimeViewIndex: 0,
  imageLastGenerated: Math.floor(Date.now() / 1000)
};

app.use((req, res, next) => {
  if (req.method !== 'GET' || (req.path !== '/status-card.png' && req.path !== '/')) {
    return res.status(403).send('Forbidden');
  }
  next();
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/', router(state));

app.listen(serverport, () => {
  console.log(`Server listening on http://localhost:${serverport}`);
});

// update discord message image every 1 minute
const updateInterval = setInterval(() => updateDiscordStatus(state), 1000 * 60 * 1);
updateDiscordStatus(state);

const cleanup = async () => {
  clearInterval(updateInterval)
  process.exit(0)
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)