import { getCurrentTimeInCentralTimeZone } from "./date";

export const logWithTime = (message: string, error?: Error) => {
  console.log(`[${getCurrentTimeInCentralTimeZone()}] ${message}`);
  if (error) {
    console.error(`[${getCurrentTimeInCentralTimeZone()}] Error: ${error.message}`);
  }
};