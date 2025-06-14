const express = require('express')
const fs = require('fs');
const path = require('path');

const IMAGE_PATH = path.join(__dirname, '../public/status-card.png');
const MAX_AGE_MS = 60 * 1000;

module.exports = (state) => {
  const router = express.Router()

  router.get('/status-card.png', async (req, res) => {
    try {
      if (!fs.existsSync(IMAGE_PATH)) {
        state.regenerate = true;
      } else {
        const age = state.imageLastGenerated;
        if (age > MAX_AGE_MS) state.regenerate = true;
      }

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'no-store');

      if (!fs.existsSync(IMAGE_PATH)) {
        return res.sendFile(path.join(__dirname, '../public/placeholder.png'));
      }

      res.sendFile(IMAGE_PATH);
    } catch (err) {
      console.error("Image handler error:", err);
      res.status(500).send('Server error');
    }
  });

  router.get('/', (req, res) => {
    res.send('Discord Status Server is running.');
  });

  return router
}