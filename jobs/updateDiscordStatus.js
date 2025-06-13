// jobs/updateDiscordStatus.js
const { editMessage } = require('../api/discord');
const { HOST_DOMAIN } = require('../lib/config');

function updateDiscordStatus() {
  const imageUrl = `${HOST_DOMAIN}/status-card.png?t=${Date.now()}`;
  editMessage(imageUrl).catch(console.error);
}

console.log("Starting Discord status updater...");

// Update every 60 seconds
updateDiscordStatus(); // run once immediately
setInterval(updateDiscordStatus, 60 * 1000);
