const express = require('express');
const { PORT } = require('./lib/config');
const router = require('./routes');
const updateDiscordStatus = require('./jobs/updateDiscordStatus');

const app = express();
const serverport = PORT || 3000;

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

app.use(router)

app.listen(serverport, () => {
  console.log(`Server listening on http://localhost:${serverport}`);
});

// update discord message image every minute
setInterval(updateDiscordStatus, 60 * 1000);
updateDiscordStatus();

const cleanup = async () => {
  clearInterval(updateDiscordStatus)
  db.close()
  process.exit(0)
}

process.on('SIGINT', cleanup)
