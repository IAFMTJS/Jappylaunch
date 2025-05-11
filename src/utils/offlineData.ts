import { romajiCache } from './romajiCache';

export async function downloadOfflineData() {
  // Download romaji-data.json
  const romajiResponse = await fetch('/romaji-data.json');
  if (!romajiResponse.ok) {
    throw new Error('Romaji-data (romaji-data.json) kon niet worden opgehaald.');
  }
  const romajiData = await romajiResponse.json();
  // Sla op in IndexedDB via romajiCache
  await romajiCache.set('romaji-data', romajiData);
} 