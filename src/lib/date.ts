export function getCurrentTimeInCentralTimeZone(): string {
  const centralTime = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })
  );
  return centralTime.toISOString();
}