const fs = require('fs');
const path = require('path');

async function generateImage() {
  // In real case: use Puppeteer, canvas, SkiaSharp, etc.
  // Here we just copy a placeholder image
  const src = path.join(__dirname, '../public/placeholder.png');
  const dest = path.join(__dirname, '../public/status-card.png');

  fs.copyFileSync(src, dest);
  console.log("Image generated.");
}

module.exports = { generateImage };
