const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const XLSX = require('xlsx');

// Function to determine if a string contains kanji
function containsKanji(str) {
    return /[\u4E00-\u9FAF]/.test(str);
}

// Function to determine if a string is hiragana
function isHiragana(str) {
    return /^[\u3040-\u309F]+$/.test(str);
}

// Function to determine if a string is katakana
function isKatakana(str) {
    return /^[\u30A0-\u30FF]+$/.test(str);
}

// Function to determine word category based on English translation
function determineCategory(english) {
    const categories = {
        'pronoun': ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that', 'these', 'those'],
        'verb': ['to', 'is', 'are', 'was', 'were', 'have', 'has', 'had', 'do', 'does', 'did', 'go', 'come', 'eat', 'drink', 'sleep', 'walk', 'run'],
        'adjective': ['big', 'small', 'good', 'bad', 'hot', 'cold', 'new', 'old', 'beautiful', 'ugly', 'happy', 'sad'],
        'adverb': ['very', 'quickly', 'slowly', 'well', 'badly', 'often', 'sometimes', 'never', 'always'],
        'number': ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'hundred', 'thousand'],
        'time': ['today', 'tomorrow', 'yesterday', 'morning', 'afternoon', 'evening', 'night', 'week', 'month', 'year'],
        'place': ['here', 'there', 'where', 'home', 'school', 'work', 'hospital', 'station', 'park', 'restaurant'],
        'family': ['mother', 'father', 'sister', 'brother', 'grandmother', 'grandfather', 'aunt', 'uncle'],
        'food': ['rice', 'bread', 'meat', 'fish', 'vegetable', 'fruit', 'water', 'tea', 'coffee', 'milk'],
        'weather': ['sunny', 'rainy', 'cloudy', 'snowy', 'hot', 'cold', 'warm', 'cool'],
        'emotion': ['happy', 'sad', 'angry', 'scared', 'surprised', 'excited', 'tired', 'bored'],
        'body': ['head', 'hand', 'foot', 'eye', 'ear', 'nose', 'mouth', 'hair', 'face'],
        'clothing': ['shirt', 'pants', 'dress', 'shoes', 'hat', 'coat', 'socks', 'underwear'],
        'transportation': ['car', 'bus', 'train', 'bicycle', 'airplane', 'ship', 'taxi', 'subway'],
        'occupation': ['teacher', 'doctor', 'student', 'worker', 'engineer', 'artist', 'writer', 'singer'],
        'education': ['school', 'university', 'class', 'book', 'pen', 'pencil', 'paper', 'test', 'exam']
    };

    const lowerEnglish = english.toLowerCase();
    for (const [category, words] of Object.entries(categories)) {
        if (words.some(word => lowerEnglish.includes(word))) {
            return category;
        }
    }
    return 'noun'; // Default to noun if no other category matches
}

// Function to determine word level based on complexity
function determineLevel(japanese, english) {
    // Simple heuristic for level determination
    if (containsKanji(japanese)) {
        return 2; // Words with kanji go to level 2
    } else if (isKatakana(japanese)) {
        return 3; // Katakana words (often loanwords) go to level 3
    } else if (isHiragana(japanese)) {
        return 1; // Basic hiragana words go to level 1
    }
    return 1; // Default to level 1
}

async function processExcel() {
    try {
        // Read the Excel file with correct extension
        const excelPath = path.join(__dirname, '..', 'japanese_words.xls');
        console.log('Reading file:', excelPath);
        const workbook = XLSX.readFile(excelPath);
        
        const processedWords = [];
        let currentCategory = '';
        
        // Process each worksheet in the workbook
        for (const sheetName of workbook.SheetNames) {
            console.log(`\nProcessing sheet: ${sheetName}`);
            const worksheet = workbook.Sheets[sheetName];
            
            // Convert to JSON
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            // Process each row
            for (const row of data) {
                // Skip empty rows
                if (!row || row.length === 0) continue;
                
                // Check if this is a category header (single cell with text)
                if (row.length === 1 && typeof row[0] === 'string' && !row[0].includes('http')) {
                    currentCategory = row[0].trim();
                    continue;
                }
                
                // Skip header rows (containing "Kana", "Kanji", etc.)
                if (row.some(cell => typeof cell === 'string' && 
                    (cell.includes('Kana') || cell.includes('Kanji') || 
                     cell.includes('English') || cell.includes('Romaji')))) {
                    continue;
                }
                
                // Skip metadata rows (containing URLs or credits)
                if (row.some(cell => typeof cell === 'string' && 
                    (cell.includes('http') || cell.includes('Credit') || 
                     cell.includes('Adapted from') || cell.includes('For more information')))) {
                    continue;
                }
                
                // Get the values from the columns
                const kana = row[0] || '';
                const kanji = row[1] || '';
                const english = row[2] || '';
                const romaji = row[3] || '';
                
                // Skip if we don't have at least kana/kanji and english
                if ((!kana && !kanji) || !english) continue;
                
                // Create word object
                const word = {
                    kana: kana.trim(),
                    kanji: kanji.trim(),
                    english: english.trim(),
                    romaji: romaji.trim(),
                    category: currentCategory || 'Uncategorized',
                    level: 'N5', // Default level
                    sheet: sheetName
                };
                
                processedWords.push(word);
            }
        }
        
        // Save processed words
        const outputPath = path.join(__dirname, '..', 'src', 'data', 'processed_words.json');
        await fs.writeFile(outputPath, JSON.stringify(processedWords, null, 2));
        
        console.log(`\nTotal processed words: ${processedWords.length}`);
        console.log(`Words saved to: ${outputPath}`);
        
        // Print statistics
        const wordsByLevel = {};
        const wordsBySheet = {};
        const wordsByCategory = {};
        
        processedWords.forEach(word => {
            wordsByLevel[word.level] = (wordsByLevel[word.level] || 0) + 1;
            wordsBySheet[word.sheet] = (wordsBySheet[word.sheet] || 0) + 1;
            wordsByCategory[word.category] = (wordsByCategory[word.category] || 0) + 1;
        });
        
        console.log('\nWords by level:', wordsByLevel);
        console.log('\nWords by sheet:', wordsBySheet);
        console.log('\nWords by category:', wordsByCategory);
        
    } catch (error) {
        console.error('Error processing Excel file:', error);
    }
}

processExcel(); 