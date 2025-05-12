const fs = require('fs');
const path = require('path');
const Kuroshiro = require('kuroshiro').default || require('kuroshiro');
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji').default || require('kuroshiro-analyzer-kuromoji');
console.log('kuromojiModule exports:', KuromojiAnalyzer);
// const KuromojiAnalyzer = kuromojiModule.default || kuromojiModule.KuromojiAnalyzer;

// Common words list (expanded)
const commonWords = [
  // Basic words
  '猫', '犬', '鳥', '魚', '本', '水', '山', '川', '空', '海',
  '花', '木', 'あめ', 'くも', 'かみ', 'みず', 'テレビ', 'ラジオ',
  'パソコン', 'カメラ', 'ピアノ', 'ギター', 'コーヒー', 'ジュース',
  // Numbers
  'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう', 'じゅう',
  // Colors
  'あか', 'あお', 'きいろ', 'しろ', 'くろ', 'みどり', 'むらさき', 'オレンジ', 'ちゃいろ', 'ピンク',
  // Common verbs
  'する', 'なる', 'ある', 'いる', '行く', '来る', '食べる', '飲む', '見る', '聞く',
  // Common adjectives
  '大きい', '小さい', '新しい', '古い', '高い', '安い', '良い', '悪い', '難しい', '易しい',
  // Common phrases
  'こんにちは', 'さようなら', 'ありがとう', 'すみません', 'おはよう', 'おやすみ',
  // JLPT N5 common words
  '私', 'あなた', '彼', '彼女', '先生', '学生', '会社', '学校', '家', '部屋',
  '時間', '今日', '明日', '昨日', '年', '月', '日', '時', '分', '秒',
  // Additional common words
  '日本語', '英語', '中国語', '韓国語', 'フランス語', 'ドイツ語', 'スペイン語',
  '大学', '高校', '中学校', '小学校', '幼稚園',
  '電車', 'バス', 'タクシー', '自転車', '車', '飛行機', '船',
  '駅', '空港', '港', '病院', '銀行', '郵便局', 'コンビニ',
  '朝', '昼', '夜', '午前', '午後', '夕方', '夜中',
  '春', '夏', '秋', '冬', '季節', '天気', '気温',
  '家族', '父', '母', '兄', '姉', '弟', '妹', '祖父', '祖母',
  '友達', '恋人', '先生', '生徒', '医者', '看護師', '警察官',
  '食べ物', '飲み物', '料理', '果物', '野菜', '肉', '魚',
  '趣味', 'スポーツ', '音楽', '映画', '本', 'ゲーム', '旅行',
  // Common verbs (additional)
  '話す', '書く', '読む', '勉強する', '働く', '遊ぶ', '寝る', '起きる',
  // Common adjectives (additional)
  '忙しい', '暇', '楽しい', '悲しい', '面白い', 'つまらない', '暑い', '寒い',
  '暖かい', '涼しい', '甘い', '辛い', '苦い', '酸っぱい', '美味しい', 'まずい',
  // JLPT N5 kanji
  '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
  '百', '千', '万', '円', '年', '月', '日', '時', '分', '秒',
  '今', '毎', '週', '週間', '月', '月間', '年', '年間',
  '上', '下', '中', '外', '前', '後', '左', '右',
  '東', '西', '南', '北', '口', '目', '耳', '手', '足',
  '人', '男', '女', '子', '母', '父', '友', '先', '生',
  '学', '校', '店', '社', '会', '駅', '電', '車', '道',
  '天', '気', '雨', '雪', '風', '空', '山', '川', '海',
  '木', '林', '森', '花', '草', '虫', '魚', '鳥', '犬', '猫',
  // Additional common kanji compounds
  '日本語', '英語', '中国語', '韓国語', '外国語',
  '大学', '高校', '中学校', '小学校', '幼稚園',
  '電車', '地下鉄', '新幹線', '飛行機', '船',
  '駅前', '空港', '港', '病院', '銀行', '郵便局',
  '朝食', '昼食', '夕食', '食事', '料理',
  '家族', '両親', '兄弟', '姉妹', '親戚',
  '友達', '恋人', '先生', '生徒', '学生',
  '会社員', '医者', '看護師', '警察官', '消防士',
  '食べ物', '飲み物', '果物', '野菜', '肉', '魚',
  '趣味', 'スポーツ', '音楽', '映画', '本', 'ゲーム'
];

// Initialize kuroshiro
const kuroshiro = new Kuroshiro();
let initialized = false;

async function initKuroshiro() {
  if (!initialized) {
    await kuroshiro.init(new KuromojiAnalyzer());
    initialized = true;
  }
}

async function convertToRomaji(text) {
  if (!initialized) {
    await initKuroshiro();
  }
  return kuroshiro.convert(text, { to: 'romaji', mode: 'spaced' });
}

async function collectQuizJapaneseText() {
  const texts = new Set();
  const quizDataPath = path.join(__dirname, '../src/data/quizData.ts');
  const quizDataContent = fs.readFileSync(quizDataPath, 'utf8');
  // Use a regex (or a simple split) to extract the "japanese" field from each quiz word (e.g. "japanese: 'カンガルー'" yields "カンガルー").
  const regex = /japanese:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(quizDataContent)) !== null) {
    texts.add(match[1].trim());
  }
  return Array.from(texts);
}

async function collectReadingPracticeJapaneseText() {
  const texts = new Set();
  const readingDataPath = path.join(__dirname, '../src/pages/Section6.tsx');
  const readingDataContent = fs.readFileSync(readingDataPath, 'utf8');
  // Use a regex (or a simple split) to extract "content" and "vocabulary" fields (e.g. "content: '…" and "vocabulary: […"). (Note: This is a simple regex; you may need to adjust it if the TSX file's structure is more complex.)
  const regexContent = /content:\s*['"]([^'"]+)['"]/g;
  const regexVocab = /vocabulary:\s*\[([^]]+)\]/g;
  let match;
  while ((match = regexContent.exec(readingDataContent)) !== null) {
    texts.add(match[1].trim());
  }
  while ((match = regexVocab.exec(readingDataContent)) !== null) {
    const vocabList = match[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
    vocabList.forEach(vocab => texts.add(vocab));
  }
  return Array.from(texts);
}

async function collectJapaneseText() {
  const texts = new Set();
  
  // Read kanji data from JSON
  const kanjiData = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/kanjiData.json'), 'utf8'));
  kanjiData.forEach(kanji => {
    texts.add(kanji.character);
    if (kanji.examples) {
      kanji.examples.forEach(example => {
        texts.add(example.word);
        texts.add(example.reading);
      });
    }
  });

  // Read JLPT data from JSON
  const jlptContent = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/jlptContent.json'), 'utf8'));
  Object.values(jlptContent).forEach(level => {
    level.grammar.forEach(grammar => {
      texts.add(grammar.pattern);
      grammar.examples.forEach(example => texts.add(example));
    });
    level.vocabulary.forEach(vocab => {
      texts.add(vocab.word);
      texts.add(vocab.reading);
    });
    level.reading.forEach(reading => {
      texts.add(reading.passage);
      reading.questions.forEach(q => {
        texts.add(q.question);
        q.options.forEach(opt => texts.add(opt));
      });
    });
  });

  // Collect quiz (games) Japanese text and merge it.
  const quizTexts = await collectQuizJapaneseText();
  quizTexts.forEach(text => texts.add(text));

  // Collect reading practice (Section6) Japanese text and merge it.
  const readingTexts = await collectReadingPracticeJapaneseText();
  readingTexts.forEach(text => texts.add(text));

  return Array.from(texts);
}

async function generateRomajiData() {
  console.log('Collecting Japanese text...');
  const texts = await collectJapaneseText();
  console.log(`Found ${texts.length} unique Japanese texts`);

  console.log('Converting to romaji...');
  const romajiData = {};
  let count = 0;
  
  for (const text of texts) {
    if (text.trim()) {
      romajiData[text] = await convertToRomaji(text);
      count++;
      if (count % 100 === 0) {
        console.log(`Converted ${count}/${texts.length} texts`);
      }
    }
  }

  console.log('Writing romaji data file...');
  const outputPath = path.join(__dirname, '../public/romaji-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(romajiData, null, 2));
  console.log(`Successfully wrote romaji data to ${outputPath}`);
}

generateRomajiData().catch(console.error); 