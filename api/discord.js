const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { DISCORD_WEBHOOK } = require('../lib/config');

const webhookUrl = DISCORD_WEBHOOK;
const dataDir = path.join(__dirname, '../data');
const messageIdPath = path.join(dataDir, 'message-id.txt');

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

async function sendMessage(imageUrl) {
  ensureDataDir();
  console.log(`[${new Date().toISOString()}] Sending new message...`);

  const res = await axios.post(`${webhookUrl}?wait=true`, {
    embeds: [
      {
        title: "Current Server Status",
        image: { url: imageUrl },
        color: 3066993,
        footer: { text: `Updated: ${new Date().toISOString()}` }
      }
    ]
  });

  fs.writeFileSync(messageIdPath, res.data.id);
  console.log(`[${new Date().toISOString()}] Message sent. ID saved: ${res.data.id}`);
}

async function editMessage(imageUrl) {
  if (!fs.existsSync(messageIdPath)) {
    console.log("Message ID file not found. Sending new message.");
    await sendMessage(imageUrl);
    return;
  }

  const messageId = fs.readFileSync(messageIdPath, 'utf-8').trim();
  const editUrl = `${webhookUrl}/messages/${messageId}`;

  await axios.patch(editUrl, {
    embeds: [
      {
        title: "Current Server Status",
        image: { url: imageUrl },
        color: 3066993,
        footer: { text: `Updated: ${new Date().toISOString()}` }
      }
    ]
  });

  console.log(`[${new Date().toISOString()}] Message edited. ID: ${messageId}`);
}

module.exports = { sendMessage, editMessage };
