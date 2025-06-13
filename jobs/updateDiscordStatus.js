// jobs/updateDiscordStatus.js
const { editMessage } = require('../api/discord');
const { HOST_DOMAIN } = require('../lib/config');

function updateDiscordStatus() {
  const imageUrl = `${HOST_DOMAIN}/status-card.png?t=${Date.now()}`;
  editMessage(imageUrl).catch(console.error);
}

console.log("Starting Discord status updater...");

module.exports = updateDiscordStatus;