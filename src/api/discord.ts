import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { DISCORD_WEBHOOK } from '../lib/config';
import { chartTimeScales } from '../lib/chartTimeScales';
import { AppState } from '../types/AppState';

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
  console.log(`[${new Date().toISOString()}] Sending new message...`);

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
    console.log(`[${new Date().toISOString()}] Message sent. ID saved: ${res.data.id}`);
  } catch (err: any) {
    console.error(`[${new Date().toISOString()}] Failed to send message:`, err.message);
  }
}

export async function editMessage(imageUrl: string, state: AppState): Promise<void> {
  if (!fs.existsSync(messageIdPath)) {
    console.log('Message ID file not found. Sending new message.');
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

    console.log(`[${new Date().toISOString()}] Message edited. ID: ${messageId}`);
  } catch (err: any) {
    console.error(`[${new Date().toISOString()}] Failed to edit message:`, err.message);
    console.log(`[${new Date().toISOString()}] Attempting to send new message instead...`);
    await sendMessage(imageUrl, state);
  }
}
