const express = require('express');
const path = require('path');
const fs = require('fs');
const { generateImage } = require('./lib/generateImage');
const { PORT } = require('./lib/config');

const app = express();
const serverport = PORT || 3000;
const IMAGE_PATH = path.join(__dirname, 'public', 'status-card.png');
const MAX_AGE_MS = 60 * 1000;

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

// Serve image (with age check + regeneration)
app.get('/status-card.png', async (req, res) => {
  try {
    let regenerate = false;

    if (!fs.existsSync(IMAGE_PATH)) {
      regenerate = true;
    } else {
      const stats = fs.statSync(IMAGE_PATH);
      const age = Date.now() - stats.mtimeMs;
      if (age > MAX_AGE_MS) regenerate = true;
    }

    if (regenerate) {
      console.log("Generating new status image...");
      await generateImage(); // Custom renderer
    }

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-store');
    res.sendFile(IMAGE_PATH);
  } catch (err) {
    console.error("Image handler error:", err);
    res.status(500).send('Server error');
  }
});

// Optional health check
app.get('/', (req, res) => {
  res.send('Discord Status Server is running.');
});

app.listen(serverport, () => {
  console.log(`Server listening on http://localhost:${serverport}`);
});
