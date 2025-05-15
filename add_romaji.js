// Usage:
// 1. Install wanakana: npm install wanakana
// 2. Run: node add_romaji.js

const fs = require('fs');
const wanakana = require('wanakana');

const filePath = 'src/data/common-words.json';

let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
let changed = false;

data.forEach(entry => {
  if (!entry.romaji && entry.hiragana) {
    entry.romaji = wanakana.toRomaji(entry.hiragana);
    changed = true;
  }
});

if (changed) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Added missing romaji fields!');
} else {
  console.log('No missing romaji fields found.');
} 