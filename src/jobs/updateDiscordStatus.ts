import { AppState } from '../types/AppState';
import { editMessage } from '../api/discord';
import { HOST_DOMAIN } from '../lib/config';
import { logWithTime } from '../lib/logWithTime';

export default async function updateDiscordStatus(state: AppState): Promise<void> {
  try {
    const cacheBusterQuery = `t=${Date.now()}`;
    const imageUrl = `${HOST_DOMAIN}/status-card.png?${cacheBusterQuery}`;

    await editMessage(imageUrl, state);
  } catch (error: any) {
    logWithTime(`Error updating Discord status: ${error.message}`);
  }
}
