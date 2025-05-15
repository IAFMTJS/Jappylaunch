const fs = require('fs');
const path = require('path');
const Kuroshiro = require('kuroshiro').default;
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');

// Import the common words list
const commonWordsList = require('../data/common-words.json');

// Initialize Kuroshiro
async function initializeKuroshiro() {
  console.log('Initializing Kuroshiro...');
  const kuroshiro = new Kuroshiro();
  await kuroshiro.init(new KuromojiAnalyzer());
  console.log('Kuroshiro initialized successfully');
  return kuroshiro;
}

// Process words in batches
async function processWordsInBatches(words, kuroshiro, batchSize = 50) {
  const results = [];
  const totalBatches = Math.ceil(words.length / batchSize);
  
  for (let i = 0; i < words.length; i += batchSize) {
    const batch = words.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1} of ${totalBatches}`);
    
    const batchPromises = batch.map(async (word) => {
      try {
        const romaji = await kuroshiro.convert(word.japanese, { to: 'romaji', mode: 'spaced' });
        return {
          ...word,
          romaji: romaji.toLowerCase().trim()
        };
      } catch (error) {
        console.error(`Error converting word "${word.japanese}":`, error);
        return {
          ...word,
          romaji: word.japanese // Fallback to original text
        };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Save progress after each batch
    saveProgress(results);
  }
  
  return results;
}

// Save progress to file
function saveProgress(words) {
  const outputPath = path.join(__dirname, '../src/data/processed-words.json');
  fs.writeFileSync(outputPath, JSON.stringify(words, null, 2));
  console.log(`Progress saved: ${words.length} words processed`);
}

// Main function
async function importCommonWords() {
  try {
    // Initialize Kuroshiro
    const kuroshiro = await initializeKuroshiro();
    
    // Process all words
    console.log(`Starting to process ${commonWordsList.length} words...`);
    const processedWords = await processWordsInBatches(commonWordsList, kuroshiro);
    
    // Save final results
    const outputPath = path.join(__dirname, '../src/data/processed-words.json');
    fs.writeFileSync(outputPath, JSON.stringify(processedWords, null, 2));
    
    // Generate romaji mapping
    const romajiMap = processedWords.reduce((acc, word) => {
      acc[word.japanese] = word.romaji;
      return acc;
    }, {});
    
    // Save romaji mapping
    const romajiPath = path.join(__dirname, '../src/data/romaji-data.json');
    fs.writeFileSync(romajiPath, JSON.stringify(romajiMap, null, 2));
    
    console.log('\nImport completed successfully!');
    console.log(`Total words processed: ${processedWords.length}`);
    console.log(`Romaji mappings saved: ${Object.keys(romajiMap).length}`);
    
    // Verify some common words
    const testWords = ['猫', '犬', '鳥', '魚', '本', '日本語', '大学', '電車'];
    console.log('\nSample conversions:');
    testWords.forEach(word => {
      console.log(`${word} -> ${romajiMap[word] || 'NOT FOUND'}`);
    });
    
  } catch (error) {
    console.error('Error during import:', error);
    process.exit(1);
  }
}

// Run the import
importCommonWords().catch(console.error); 