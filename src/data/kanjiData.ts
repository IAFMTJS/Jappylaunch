export type Difficulty = 'easy' | 'medium' | 'hard';
export type KanjiCategory = 'nature' | 'people' | 'body' | 'numbers' | 'time' | 'position' | 'size' | 'currency';

export interface KanjiExample {
  word: string;
  reading: string;
  meaning: string;
}

export interface Kanji {
  character: string;
  english: string;
  kunyomi: string[];
  onyomi: string[];
  difficulty: Difficulty;
  category: KanjiCategory;
  hint?: string;
  examples?: KanjiExample[];
  strokeCount: number;
  radicals: string[];
  jlptLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
}

export const kanjiList: Kanji[] = [
  {
    character: '日',
    english: 'sun, day',
    onyomi: ['ニチ', 'ジツ'],
    kunyomi: ['ひ', 'か'],
    examples: [
      { word: '日本', reading: 'にほん', meaning: 'Japan' },
      { word: '今日', reading: 'きょう', meaning: 'today' },
      { word: '日曜日', reading: 'にちようび', meaning: 'Sunday' }
    ],
    difficulty: 'easy',
    category: 'nature',
    hint: 'Looks like a sun with rays',
    strokeCount: 4,
    radicals: ['日'],
    jlptLevel: 'N5'
  },
  {
    character: '月',
    english: 'moon, month',
    onyomi: ['ゲツ', 'ガツ'],
    kunyomi: ['つき'],
    examples: [
      { word: '月曜日', reading: 'げつようび', meaning: 'Monday' },
      { word: '一月', reading: 'いちがつ', meaning: 'January' },
      { word: '月見', reading: 'つきみ', meaning: 'moon viewing' }
    ],
    difficulty: 'easy',
    category: 'nature',
    hint: 'Looks like a crescent moon',
    strokeCount: 4,
    radicals: ['月'],
    jlptLevel: 'N5'
  },
  {
    character: '水',
    english: 'water',
    onyomi: ['スイ'],
    kunyomi: ['みず'],
    examples: [
      { word: '水曜日', reading: 'すいようび', meaning: 'Wednesday' },
      { word: '水泳', reading: 'すいえい', meaning: 'swimming' },
      { word: '水着', reading: 'みずぎ', meaning: 'swimsuit' }
    ],
    difficulty: 'easy',
    category: 'nature',
    hint: 'Looks like flowing water',
    strokeCount: 4,
    radicals: ['水'],
    jlptLevel: 'N5'
  },
  {
    character: '火',
    english: 'fire',
    onyomi: ['カ'],
    kunyomi: ['ひ', 'ほ'],
    examples: [
      { word: '火曜日', reading: 'かようび', meaning: 'Tuesday' },
      { word: '火山', reading: 'かざん', meaning: 'volcano' },
      { word: '火事', reading: 'かじ', meaning: 'fire' }
    ],
    difficulty: 'easy',
    category: 'nature',
    hint: 'Looks like flames',
    strokeCount: 4,
    radicals: ['火'],
    jlptLevel: 'N5'
  },
  {
    character: '木',
    english: 'tree, wood',
    onyomi: ['ボク', 'モク'],
    kunyomi: ['き', 'こ'],
    examples: [
      { word: '木曜日', reading: 'もくようび', meaning: 'Thursday' },
      { word: '木村', reading: 'きむら', meaning: 'Kimura (surname)' },
      { word: '木造', reading: 'もくぞう', meaning: 'wooden' }
    ],
    difficulty: 'easy',
    category: 'nature',
    hint: 'Looks like a tree with branches',
    strokeCount: 4,
    radicals: ['木'],
    jlptLevel: 'N5'
  },
  {
    character: '金',
    english: 'gold, money',
    onyomi: ['キン', 'コン'],
    kunyomi: ['かね', 'かな'],
    examples: [
      { word: '金曜日', reading: 'きんようび', meaning: 'Friday' },
      { word: '金魚', reading: 'きんぎょ', meaning: 'goldfish' },
      { word: 'お金', reading: 'おかね', meaning: 'money' }
    ],
    difficulty: 'easy',
    category: 'nature',
    hint: 'Looks like a treasure chest',
    strokeCount: 8,
    radicals: ['金'],
    jlptLevel: 'N5'
  },
  {
    character: '土',
    english: 'earth, soil',
    onyomi: ['ド', 'ト'],
    kunyomi: ['つち'],
    examples: [
      { word: '土曜日', reading: 'どようび', meaning: 'Saturday' },
      { word: '土地', reading: 'とち', meaning: 'land' },
      { word: '土産', reading: 'みやげ', meaning: 'souvenir' }
    ],
    difficulty: 'easy',
    category: 'nature',
    hint: 'Looks like soil in a field',
    strokeCount: 3,
    radicals: ['土'],
    jlptLevel: 'N5'
  },
  {
    character: '人',
    english: 'person',
    onyomi: ['ジン', 'ニン'],
    kunyomi: ['ひと'],
    examples: [
      { word: '日本人', reading: 'にほんじん', meaning: 'Japanese person' },
      { word: '一人', reading: 'ひとり', meaning: 'one person' },
      { word: '人口', reading: 'じんこう', meaning: 'population' }
    ],
    difficulty: 'easy',
    category: 'people',
    hint: 'Looks like a person walking',
    strokeCount: 4,
    radicals: ['人'],
    jlptLevel: 'N5'
  },
  {
    character: '口',
    english: 'mouth',
    onyomi: ['コウ', 'ク'],
    kunyomi: ['くち'],
    examples: [
      { word: '人口', reading: 'じんこう', meaning: 'population' },
      { word: '出口', reading: 'でぐち', meaning: 'exit' },
      { word: '入口', reading: 'いりぐち', meaning: 'entrance' }
    ],
    difficulty: 'easy',
    category: 'body',
    hint: 'Looks like an open mouth',
    strokeCount: 3,
    radicals: ['口'],
    jlptLevel: 'N5'
  },
  {
    character: '手',
    english: 'hand',
    onyomi: ['シュ'],
    kunyomi: ['て'],
    examples: [
      { word: '上手', reading: 'じょうず', meaning: 'skillful' },
      { word: '下手', reading: 'へた', meaning: 'unskillful' },
      { word: '手紙', reading: 'てがみ', meaning: 'letter' }
    ],
    difficulty: 'easy',
    category: 'body',
    hint: 'Looks like a hand with fingers',
    strokeCount: 4,
    radicals: ['手'],
    jlptLevel: 'N5'
  },
  {
    character: '目',
    english: 'eye',
    onyomi: ['モク', 'ボク'],
    kunyomi: ['め'],
    examples: [
      { word: '目的', reading: 'もくてき', meaning: 'purpose' },
      { word: '目次', reading: 'もくじ', meaning: 'table of contents' },
      { word: '目玉', reading: 'めだま', meaning: 'eyeball' }
    ],
    difficulty: 'easy',
    category: 'body',
    hint: 'Looks like an eye with eyelashes',
    strokeCount: 4,
    radicals: ['目'],
    jlptLevel: 'N5'
  },
  {
    character: '耳',
    english: 'ear',
    onyomi: ['ジ'],
    kunyomi: ['みみ'],
    examples: [
      { word: '耳鼻科', reading: 'じびか', meaning: 'ear, nose, and throat' },
      { word: '耳鳴り', reading: 'みみなり', meaning: 'ringing in ears' },
      { word: '耳元', reading: 'みみもと', meaning: 'close to ear' }
    ],
    difficulty: 'easy',
    category: 'body',
    hint: 'Looks like an ear',
    strokeCount: 6,
    radicals: ['耳'],
    jlptLevel: 'N5'
  },
  {
    character: '足',
    english: 'foot, leg',
    onyomi: ['ソク'],
    kunyomi: ['あし', 'た'],
    examples: [
      { word: '足音', reading: 'あしおと', meaning: 'footsteps' },
      { word: '足跡', reading: 'あしあと', meaning: 'footprints' },
      { word: '満足', reading: 'まんぞく', meaning: 'satisfaction' }
    ],
    difficulty: 'easy',
    category: 'body',
    hint: 'Looks like a foot with toes',
    strokeCount: 7,
    radicals: ['足'],
    jlptLevel: 'N5'
  },
  {
    character: '山',
    english: 'mountain',
    onyomi: ['サン'],
    kunyomi: ['やま'],
    examples: [
      { word: '富士山', reading: 'ふじさん', meaning: 'Mount Fuji' },
      { word: '火山', reading: 'かざん', meaning: 'volcano' },
      { word: '山登り', reading: 'やまのぼり', meaning: 'mountain climbing' }
    ],
    difficulty: 'easy',
    category: 'nature',
    hint: 'Looks like three mountain peaks',
    strokeCount: 3,
    radicals: ['山'],
    jlptLevel: 'N5'
  },
  {
    character: '川',
    english: 'river',
    onyomi: ['セン'],
    kunyomi: ['かわ'],
    examples: [
      { word: '川辺', reading: 'かわべ', meaning: 'riverside' },
      { word: '川下り', reading: 'かわくだり', meaning: 'river rafting' },
      { word: '川原', reading: 'かわら', meaning: 'riverbed' }
    ],
    difficulty: 'easy',
    category: 'nature',
    hint: 'Looks like flowing water',
    strokeCount: 3,
    radicals: ['川'],
    jlptLevel: 'N5'
  },
  {
    character: '田',
    english: 'rice field',
    onyomi: ['デン'],
    kunyomi: ['た'],
    examples: [
      { word: '田舎', reading: 'いなか', meaning: 'countryside' },
      { word: '田園', reading: 'でんえん', meaning: 'rural area' },
      { word: '田植え', reading: 'たうえ', meaning: 'rice planting' }
    ],
    difficulty: 'easy',
    category: 'nature',
    hint: 'Looks like a rice field divided into sections',
    strokeCount: 5,
    radicals: ['田'],
    jlptLevel: 'N5'
  },
  {
    character: '中',
    english: 'middle, inside',
    onyomi: ['チュウ'],
    kunyomi: ['なか'],
    examples: [
      { word: '中国', reading: 'ちゅうごく', meaning: 'China' },
      { word: '中心', reading: 'ちゅうしん', meaning: 'center' },
      { word: '中止', reading: 'ちゅうし', meaning: 'cancellation' }
    ],
    difficulty: 'easy',
    category: 'position',
    hint: 'Looks like a line through the middle',
    strokeCount: 4,
    radicals: ['中'],
    jlptLevel: 'N5'
  },
  {
    character: '大',
    english: 'big, large',
    onyomi: ['ダイ', 'タイ'],
    kunyomi: ['おお'],
    examples: [
      { word: '大学', reading: 'だいがく', meaning: 'university' },
      { word: '大人', reading: 'おとな', meaning: 'adult' },
      { word: '大好き', reading: 'だいすき', meaning: 'really like' }
    ],
    difficulty: 'easy',
    category: 'size',
    hint: 'Looks like a person with arms spread wide',
    strokeCount: 3,
    radicals: ['大'],
    jlptLevel: 'N5'
  },
  {
    character: '小',
    english: 'small',
    onyomi: ['ショウ'],
    kunyomi: ['ちい', 'こ'],
    examples: [
      { word: '小学校', reading: 'しょうがっこう', meaning: 'elementary school' },
      { word: '小さい', reading: 'ちいさい', meaning: 'small' },
      { word: '小鳥', reading: 'ことり', meaning: 'small bird' }
    ],
    difficulty: 'easy',
    category: 'size',
    hint: 'Looks like something small',
    strokeCount: 3,
    radicals: ['小'],
    jlptLevel: 'N5'
  },
  {
    character: '上',
    english: 'up, above',
    onyomi: ['ジョウ', 'ショウ'],
    kunyomi: ['うえ', 'あ'],
    examples: [
      { word: '上手', reading: 'じょうず', meaning: 'skillful' },
      { word: '上着', reading: 'うわぎ', meaning: 'jacket' },
      { word: '上達', reading: 'じょうたつ', meaning: 'improvement' }
    ],
    difficulty: 'easy',
    category: 'position',
    hint: 'Looks like something pointing upward',
    strokeCount: 3,
    radicals: ['上'],
    jlptLevel: 'N5'
  },
  {
    character: '下',
    english: 'down, below',
    onyomi: ['カ', 'ゲ'],
    kunyomi: ['した', 'くだ'],
    examples: [
      { word: '下手', reading: 'へた', meaning: 'unskillful' },
      { word: '下着', reading: 'したぎ', meaning: 'underwear' },
      { word: '下車', reading: 'げしゃ', meaning: 'getting off a vehicle' }
    ],
    difficulty: 'easy',
    category: 'position',
    hint: 'Looks like something pointing downward',
    strokeCount: 3,
    radicals: ['下'],
    jlptLevel: 'N5'
  },
  {
    character: '一',
    english: 'one',
    onyomi: ['イチ', 'イツ'],
    kunyomi: ['ひと'],
    examples: [
      { word: '一人', reading: 'ひとり', meaning: 'one person' },
      { word: '一月', reading: 'いちがつ', meaning: 'January' },
      { word: '一日', reading: 'いちにち', meaning: 'one day' }
    ],
    difficulty: 'easy',
    category: 'numbers',
    hint: 'Just one line',
    strokeCount: 1,
    radicals: ['一'],
    jlptLevel: 'N5'
  },
  {
    character: '二',
    english: 'two',
    onyomi: ['ニ'],
    kunyomi: ['ふた'],
    examples: [
      { word: '二人', reading: 'ふたり', meaning: 'two people' },
      { word: '二月', reading: 'にがつ', meaning: 'February' },
      { word: '二日', reading: 'ふつか', meaning: 'second day' }
    ],
    difficulty: 'easy',
    category: 'numbers',
    hint: 'Two parallel lines',
    strokeCount: 2,
    radicals: ['二'],
    jlptLevel: 'N5'
  },
  {
    character: '三',
    english: 'three',
    onyomi: ['サン'],
    kunyomi: ['み'],
    examples: [
      { word: '三人', reading: 'さんにん', meaning: 'three people' },
      { word: '三月', reading: 'さんがつ', meaning: 'March' },
      { word: '三日', reading: 'みっか', meaning: 'third day' }
    ],
    difficulty: 'easy',
    category: 'numbers',
    hint: 'Three parallel lines',
    strokeCount: 3,
    radicals: ['三'],
    jlptLevel: 'N5'
  },
  {
    character: '四',
    english: 'four',
    onyomi: ['シ'],
    kunyomi: ['よ', 'よん'],
    examples: [
      { word: '四人', reading: 'よにん', meaning: 'four people' },
      { word: '四月', reading: 'しがつ', meaning: 'April' },
      { word: '四日', reading: 'よっか', meaning: 'fourth day' }
    ],
    difficulty: 'easy',
    category: 'numbers',
    hint: 'Looks like a box with a line inside',
    strokeCount: 5,
    radicals: ['四'],
    jlptLevel: 'N5'
  },
  {
    character: '五',
    english: 'five',
    onyomi: ['ゴ'],
    kunyomi: ['いつ'],
    examples: [
      { word: '五人', reading: 'ごにん', meaning: 'five people' },
      { word: '五月', reading: 'ごがつ', meaning: 'May' },
      { word: '五日', reading: 'いつか', meaning: 'fifth day' }
    ],
    difficulty: 'easy',
    category: 'numbers',
    hint: 'Looks like a hand with five fingers',
    strokeCount: 4,
    radicals: ['五'],
    jlptLevel: 'N5'
  },
  {
    character: '六',
    english: 'six',
    onyomi: ['ロク'],
    kunyomi: ['む'],
    examples: [
      { word: '六人', reading: 'ろくにん', meaning: 'six people' },
      { word: '六月', reading: 'ろくがつ', meaning: 'June' },
      { word: '六日', reading: 'むいか', meaning: 'sixth day' }
    ],
    difficulty: 'easy',
    category: 'numbers',
    hint: 'Looks like a roof with a line underneath',
    strokeCount: 6,
    radicals: ['六'],
    jlptLevel: 'N5'
  },
  {
    character: '七',
    english: 'seven',
    onyomi: ['シチ'],
    kunyomi: ['なな'],
    examples: [
      { word: '七人', reading: 'しちにん', meaning: 'seven people' },
      { word: '七月', reading: 'しちがつ', meaning: 'July' },
      { word: '七日', reading: 'なのか', meaning: 'seventh day' }
    ],
    difficulty: 'easy',
    category: 'numbers',
    hint: 'Looks like a cross with a line',
    strokeCount: 4,
    radicals: ['七'],
    jlptLevel: 'N5'
  },
  {
    character: '八',
    english: 'eight',
    onyomi: ['ハチ'],
    kunyomi: ['や'],
    examples: [
      { word: '八人', reading: 'はちにん', meaning: 'eight people' },
      { word: '八月', reading: 'はちがつ', meaning: 'August' },
      { word: '八日', reading: 'ようか', meaning: 'eighth day' }
    ],
    difficulty: 'easy',
    category: 'numbers',
    hint: 'Looks like two lines spreading apart',
    strokeCount: 5,
    radicals: ['八'],
    jlptLevel: 'N5'
  },
  {
    character: '九',
    english: 'nine',
    onyomi: ['キュウ', 'ク'],
    kunyomi: ['ここの'],
    examples: [
      { word: '九人', reading: 'きゅうにん', meaning: 'nine people' },
      { word: '九月', reading: 'くがつ', meaning: 'September' },
      { word: '九日', reading: 'ここのか', meaning: 'ninth day' }
    ],
    difficulty: 'easy',
    category: 'numbers',
    hint: 'Looks like a hook',
    strokeCount: 9,
    radicals: ['九'],
    jlptLevel: 'N5'
  },
  {
    character: '十',
    english: 'ten',
    onyomi: ['ジュウ', 'ジッ'],
    kunyomi: ['とお'],
    examples: [
      { word: '十人', reading: 'じゅうにん', meaning: 'ten people' },
      { word: '十月', reading: 'じゅうがつ', meaning: 'October' },
      { word: '十日', reading: 'とおか', meaning: 'tenth day' }
    ],
    difficulty: 'easy',
    category: 'numbers',
    hint: 'Looks like a plus sign',
    strokeCount: 4,
    radicals: ['十'],
    jlptLevel: 'N5'
  },
  {
    character: '百',
    english: 'hundred',
    onyomi: ['ヒャク'],
    kunyomi: ['もも'],
    examples: [
      { word: '百円', reading: 'ひゃくえん', meaning: '100 yen' },
      { word: '百貨店', reading: 'ひゃっかてん', meaning: 'department store' },
      { word: '百倍', reading: 'ひゃくばい', meaning: 'hundredfold' }
    ],
    difficulty: 'easy',
    category: 'numbers',
    hint: 'Looks like a one with a line on top',
    strokeCount: 6,
    radicals: ['百'],
    jlptLevel: 'N5'
  },
  {
    character: '千',
    english: 'thousand',
    onyomi: ['セン'],
    kunyomi: ['ち'],
    examples: [
      { word: '千円', reading: 'せんえん', meaning: '1000 yen' },
      { word: '千葉', reading: 'ちば', meaning: 'Chiba (prefecture)' },
      { word: '千代', reading: 'ちよ', meaning: 'thousand years' }
    ],
    difficulty: 'easy',
    category: 'numbers',
    hint: 'Looks like a person with a line on top',
    strokeCount: 3,
    radicals: ['千'],
    jlptLevel: 'N5'
  },
  {
    character: '万',
    english: 'ten thousand',
    onyomi: ['マン', 'バン'],
    kunyomi: ['よろず'],
    examples: [
      { word: '一万円', reading: 'いちまんえん', meaning: '10,000 yen' },
      { word: '万年筆', reading: 'まんねんひつ', meaning: 'fountain pen' },
      { word: '万国', reading: 'ばんこく', meaning: 'all nations' }
    ],
    difficulty: 'easy',
    category: 'numbers',
    hint: 'Looks like a box with a line inside',
    strokeCount: 3,
    radicals: ['万'],
    jlptLevel: 'N5'
  },
  {
    character: '円',
    english: 'circle, yen',
    onyomi: ['エン'],
    kunyomi: ['まる'],
    examples: [
      { word: '円形', reading: 'えんけい', meaning: 'circular' },
      { word: '円周', reading: 'えんしゅう', meaning: 'circumference' },
      { word: '円満', reading: 'えんまん', meaning: 'harmonious' }
    ],
    difficulty: 'easy',
    category: 'currency',
    hint: 'Looks like a circle',
    strokeCount: 3,
    radicals: ['円'],
    jlptLevel: 'N5'
  },
  {
    character: '年',
    english: 'year',
    onyomi: ['ネン'],
    kunyomi: ['とし'],
    examples: [
      { word: '今年', reading: 'ことし', meaning: 'this year' },
      { word: '去年', reading: 'きょねん', meaning: 'last year' },
      { word: '来年', reading: 'らいねん', meaning: 'next year' }
    ],
    difficulty: 'easy',
    category: 'time',
    hint: 'Looks like a person with a line on top',
    strokeCount: 6,
    radicals: ['年'],
    jlptLevel: 'N5'
  },
  {
    character: '月',
    english: 'month, moon',
    onyomi: ['ゲツ', 'ガツ'],
    kunyomi: ['つき'],
    examples: [
      { word: '一月', reading: 'いちがつ', meaning: 'January' },
      { word: '今月', reading: 'こんげつ', meaning: 'this month' },
      { word: '月見', reading: 'つきみ', meaning: 'moon viewing' }
    ],
    difficulty: 'easy',
    category: 'time',
    hint: 'Looks like a crescent moon',
    strokeCount: 4,
    radicals: ['月'],
    jlptLevel: 'N5'
  },
  {
    character: '日',
    english: 'day, sun',
    onyomi: ['ニチ', 'ジツ'],
    kunyomi: ['ひ', 'か'],
    examples: [
      { word: '今日', reading: 'きょう', meaning: 'today' },
      { word: '昨日', reading: 'きのう', meaning: 'yesterday' },
      { word: '明日', reading: 'あした', meaning: 'tomorrow' }
    ],
    difficulty: 'easy',
    category: 'time',
    hint: 'Looks like a sun with rays',
    strokeCount: 4,
    radicals: ['日'],
    jlptLevel: 'N5'
  },
  {
    character: '時',
    english: 'time, hour',
    onyomi: ['ジ'],
    kunyomi: ['とき'],
    examples: [
      { word: '時間', reading: 'じかん', meaning: 'time' },
      { word: '時計', reading: 'とけい', meaning: 'clock' },
      { word: '一時', reading: 'いちじ', meaning: 'one o\'clock' }
    ],
    difficulty: 'easy',
    category: 'time',
    hint: 'Looks like a sun with a line',
    strokeCount: 7,
    radicals: ['時'],
    jlptLevel: 'N5'
  },
  {
    character: '分',
    english: 'minute, part',
    onyomi: ['ブン', 'フン'],
    kunyomi: ['わ'],
    examples: [
      { word: '分かる', reading: 'わかる', meaning: 'to understand' },
      { word: '自分', reading: 'じぶん', meaning: 'oneself' },
      { word: '十分', reading: 'じゅうぶん', meaning: 'sufficient' }
    ],
    difficulty: 'easy',
    category: 'time',
    hint: 'Looks like a knife cutting something',
    strokeCount: 4,
    radicals: ['分'],
    jlptLevel: 'N5'
  },
  {
    character: '今',
    english: 'now',
    onyomi: ['コン', 'キン'],
    kunyomi: ['いま'],
    examples: [
      { word: '今日', reading: 'きょう', meaning: 'today' },
      { word: '今月', reading: 'こんげつ', meaning: 'this month' },
      { word: '今年', reading: 'ことし', meaning: 'this year' }
    ],
    difficulty: 'easy',
    category: 'time',
    hint: 'Looks like a person with a line on top',
    strokeCount: 9,
    radicals: ['今'],
    jlptLevel: 'N5'
  },
  {
    character: '先',
    english: 'previous, ahead',
    onyomi: ['セン'],
    kunyomi: ['さき'],
    examples: [
      { word: '先生', reading: 'せんせい', meaning: 'teacher' },
      { word: '先週', reading: 'せんしゅう', meaning: 'last week' },
      { word: '先月', reading: 'せんげつ', meaning: 'last month' }
    ],
    difficulty: 'easy',
    category: 'time',
    hint: 'Looks like a person with a line on top',
    strokeCount: 6,
    radicals: ['先'],
    jlptLevel: 'N5'
  },
  {
    character: '後',
    english: 'after, behind',
    onyomi: ['ゴ', 'コウ'],
    kunyomi: ['あと', 'うし'],
    examples: [
      { word: '午後', reading: 'ごご', meaning: 'afternoon' },
      { word: '後ろ', reading: 'うしろ', meaning: 'behind' },
      { word: '最後', reading: 'さいご', meaning: 'last' }
    ],
    difficulty: 'easy',
    category: 'time',
    hint: 'Looks like a person with a line on top',
    strokeCount: 6,
    radicals: ['後'],
    jlptLevel: 'N5'
  }
]; 