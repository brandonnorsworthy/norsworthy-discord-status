import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { DISCORD_WEBHOOK } from '../lib/config';
import { chartTimeScales } from '../lib/chartTimeScales';
import { AppState } from '../types/AppState';
import { logWithTime } from '../lib/logWithTime';

const webhookUrl = DISCORD_WEBHOOK;
const dataDir = path.join(__dirname, '../../data');
const messageIdPath = path.join(dataDir, 'message-id.txt');

function ensureDataDir(): void {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

async function sendMessage(imageUrl: string, state: AppState): Promise<void> {
  ensureDataDir();
  logWithTime(`Sending new message...`);

  try {
    const res = await axios.post(`${webhookUrl}?wait=true`, {
      embeds: [
        {
          title: 'Current Server Status',
          image: { url: imageUrl },
          content: `Status Generated at <t:${state.imageLastGenerated}>, Current View: ${chartTimeScales[state.currentTimeViewIndex].title}`,
          color: 3066993,
        },
      ],
    });

    fs.writeFileSync(messageIdPath, res.data.id);
    logWithTime(`Message sent. ID saved: ${res.data.id}`);
  } catch (err: any) {
    logWithTime(`Failed to send message:`, err.message);
  }
}

export async function editMessage(imageUrl: string, state: AppState): Promise<void> {
  if (!fs.existsSync(messageIdPath)) {
    logWithTime('Message ID file not found. Sending new message.');
    await sendMessage(imageUrl, state);
    return;
  }

  const messageId = fs.readFileSync(messageIdPath, 'utf-8').trim();
  const editUrl = `${webhookUrl}/messages/${messageId}`;

  try {
    await axios.patch(editUrl, {
      embeds: [
        {
          title: 'Current Server Status',
          content: `Status Generated at <t:${state.imageLastGenerated}>, Current View: ${chartTimeScales[state.currentTimeViewIndex].title}`,
          image: { url: imageUrl },
          color: 3066993,
        },
      ],
    });

    logWithTime(`Message edited. ID: ${messageId}`);
  } catch (err: any) {
    logWithTime(`Failed to edit message:`, err.message);

    if (err.response && err.response.status === 404) {
      // Message not found, remove the message ID file
      if (fs.existsSync(messageIdPath)) {
        fs.unlinkSync(messageIdPath);
        logWithTime(`Message ID file deleted due to 404.`);
      }
      logWithTime(`Received 404. Attempting to send new message...`);
      await sendMessage(imageUrl, state);
    }
  }
}
