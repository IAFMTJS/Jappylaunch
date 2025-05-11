import { romajiCache } from './romajiCache';
import romajiData from '../data/romaji-data.json';

export async function downloadOfflineData() {
  try {
    console.log('Loading romaji data from imported JSON...');
    // Store the imported data directly in the cache
    await romajiCache.setBatch(romajiData);
    console.log('Successfully loaded and cached romaji data:', Object.keys(romajiData).length, 'entries');
  } catch (error) {
    console.error('Error loading romaji data:', error);
    throw error;
  }
} 