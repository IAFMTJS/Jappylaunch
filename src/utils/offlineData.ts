import { romajiCache } from './romajiCache';

export async function downloadOfflineData() {
  let romajiData: Record<string, string> = {};
  let romajiResponse: Response | null = null;

  // Try multiple possible paths for romaji-data.json
  const possiblePaths = [
    '/romaji-data.json',  // Absolute path (works on Netlify)
    'romaji-data.json',   // Relative path (works locally)
    './romaji-data.json'  // Explicit relative path
  ];

  for (const path of possiblePaths) {
    try {
      console.log(`Trying to fetch romaji data from: ${path}`);
      romajiResponse = await fetch(path);
      if (romajiResponse.ok) {
        console.log(`Successfully fetched romaji data from: ${path}`);
        break;
      }
    } catch (e) {
      console.warn(`Failed to fetch from ${path}:`, e);
    }
  }

  if (romajiResponse && romajiResponse.ok) {
    try {
      romajiData = await romajiResponse.json();
      console.log('Successfully parsed romaji data:', Object.keys(romajiData).length, 'entries');
    } catch (e) {
      console.error('Failed to parse romaji data:', e);
    }
  } else {
    console.warn('Could not fetch romaji data from any path');
  }

  // Merge fetched romaji data into romajiCache
  if (Object.keys(romajiData).length > 0) {
    console.log('Storing romaji data in cache...');
    await romajiCache.setBatch(romajiData);
    console.log('Romaji data stored in cache successfully');
  } else {
    console.warn('No romaji data to store in cache');
  }
} 