import { romajiCache } from './romajiCache';

export async function downloadOfflineData() {
  let romajiData: Record<string, string> = {};
  let romajiResponse: Response | null = null;

  // Try fetching romaji-data.json (with a fallback fetch from /romaji-data.json if the first fetch fails)
  try {
    romajiResponse = await fetch("romaji-data.json");
  } catch (e) {
    console.warn("Fetching romaji-data.json failed, falling back to /romaji-data.json");
    romajiResponse = await fetch("/romaji-data.json");
  }

  if (romajiResponse && romajiResponse.ok) {
    romajiData = await romajiResponse.json();
  } else {
    console.warn("Romaji-data (romaji-data.json) kon niet worden opgehaald, using empty fallback.");
  }

  // Merge fetched romaji data (or an empty object if fetch fails) into romajiCache (via romajiCache.setBatch) so that romaji conversion (via kuroshiro) is available everywhere.
  await romajiCache.setBatch(romajiData);
} 