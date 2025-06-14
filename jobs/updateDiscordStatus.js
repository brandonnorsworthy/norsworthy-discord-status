const { editMessage } = require('../api/discord');
const { HOST_DOMAIN } = require('../lib/config');
const { generateImage } = require('../lib/generateImage');

async function updateDiscordStatus(state) {
  try {

    if (!state.isGenerating && state.regenerate) {
      await generateImage(state);
    }
  } catch (error) {
    console.log(`[${new Date().toISOString()}] Error generating image: ${error.message}`);
  }

  try {
    const cacheBusterQuery = `t=${Date.now()}`;
    const imageUrl = `${HOST_DOMAIN}/status-card.png?${cacheBusterQuery}`;

    await editMessage(imageUrl, state);
  } catch (error) {
    console.log(`[${new Date().toISOString()}] Error updating Discord status: ${error.message}`);
  }
}

module.exports = updateDiscordStatus;