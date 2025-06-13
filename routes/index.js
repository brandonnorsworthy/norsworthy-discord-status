const express = require('express')
const fs = require('fs');
const path = require('path');
const { generateImage } = require('../lib/generateImage');

const IMAGE_PATH = path.join(__dirname, 'public', 'status-card.png');
const MAX_AGE_MS = 60 * 1000;

module.exports = () => {
  const router = express.Router()

  router.get('/status-card.png', async (req, res) => {
    try {
      let regenerate = false;

      if (!fs.existsSync(IMAGE_PATH)) {
        regenerate = true;
      } else {
        const stats = fs.statSync(IMAGE_PATH);
        const age = Date.now() - stats.mtimeMs;
        if (age > MAX_AGE_MS) regenerate = true;
      }

      console.log("Generating new status image...");
      if (regenerate) {
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

  app.get('/', (req, res) => {
    res.send('Discord Status Server is running.');
  });

  return router
}