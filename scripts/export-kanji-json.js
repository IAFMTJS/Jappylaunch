const fs = require('fs');
const path = require('path');

// Import the TypeScript file as plain text
const kanjiDataTs = fs.readFileSync(path.join(__dirname, '../src/data/kanjiData.ts'), 'utf8');

// Extract the kanjiList array using a regex (simple, assumes well-formed file)
const match = kanjiDataTs.match(/export const kanjiList: Kanji\[\] = (\[.*?\n\];)/s);
if (!match) {
  console.error('Could not find kanjiList in kanjiData.ts');
  process.exit(1);
}

let kanjiListStr = match[1];
// Remove trailing semicolon
kanjiListStr = kanjiListStr.replace(/;\s*$/, '');

// Replace single quotes with double quotes, and fix trailing commas
kanjiListStr = kanjiListStr
  .replace(/'/g, '"')
  .replace(/,\s*([\]\}])/g, '$1');

// Try to parse as JSON
let kanjiList;
try {
  kanjiList = JSON.parse(kanjiListStr);
} catch (e) {
  console.error('Failed to parse kanjiList as JSON:', e);
  process.exit(1);
}

// Write to public/kanjiData.json
fs.writeFileSync(path.join(__dirname, '../public/kanjiData.json'), JSON.stringify(kanjiList, null, 2));
console.log('Exported kanjiList to public/kanjiData.json'); 