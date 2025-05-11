export type Category = 'food' | 'animals' | 'colors' | 'numbers' | 'family' | 'weather' | 'time' | 
  'transportation' | 'clothing' | 'body' | 'emotions' | 'school' | 'work' | 'hobbies' | 'nature' | 
  'house' | 'city' | 'technology' | 'health' | 'hiragana' | 'katakana' | 'all';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuizWord {
  japanese: string;
  english: string;
  category: Category;
  difficulty: Difficulty;
  hint?: string;
  romaji?: string;
  isHiragana: boolean;
  isKatakana: boolean;
}

export const quizWords: QuizWord[] = [
  // Food
  { japanese: 'りんご', english: 'apple', category: 'food', difficulty: 'easy', hint: 'A common red fruit', romaji: 'ringo', isHiragana: true, isKatakana: false },
  { japanese: 'バナナ', english: 'banana', category: 'food', difficulty: 'easy', hint: 'Yellow curved fruit', romaji: 'banana', isHiragana: false, isKatakana: true },
  { japanese: 'みかん', english: 'mandarin', category: 'food', difficulty: 'easy', hint: 'Small orange citrus fruit', romaji: 'mikan', isHiragana: true, isKatakana: false },
  { japanese: 'ぶどう', english: 'grape', category: 'food', difficulty: 'easy', hint: 'Small round fruits that grow in clusters', romaji: 'budou', isHiragana: true, isKatakana: false },
  { japanese: 'いちご', english: 'strawberry', category: 'food', difficulty: 'easy', hint: 'Red fruit with seeds on the outside', romaji: 'ichigo', isHiragana: true, isKatakana: false },
  { japanese: 'トマト', english: 'tomato', category: 'food', difficulty: 'easy', hint: 'Red fruit often used in salads', romaji: 'tomato', isHiragana: false, isKatakana: true },
  { japanese: 'にんじん', english: 'carrot', category: 'food', difficulty: 'easy', hint: 'Orange root vegetable', romaji: 'ninjin', isHiragana: true, isKatakana: false },
  { japanese: 'ピーマン', english: 'bell pepper', category: 'food', difficulty: 'easy', hint: 'Comes in green, red, and yellow', romaji: 'piiman', isHiragana: false, isKatakana: true },
  { japanese: 'なす', english: 'eggplant', category: 'food', difficulty: 'easy', hint: 'Purple vegetable', romaji: 'nasu', isHiragana: true, isKatakana: false },
  { japanese: 'キャベツ', english: 'cabbage', category: 'food', difficulty: 'easy', hint: 'Round leafy vegetable', romaji: 'kyabetsu', isHiragana: false, isKatakana: true },
  { japanese: 'ブロッコリー', english: 'broccoli', category: 'food', difficulty: 'easy', hint: 'Green vegetable with small florets', romaji: 'burokkorii', isHiragana: false, isKatakana: true },
  { japanese: 'アスパラガス', english: 'asparagus', category: 'food', difficulty: 'easy', hint: 'Long green stalks', romaji: 'asuparagasu', isHiragana: false, isKatakana: true },
  { japanese: 'カリフラワー', english: 'cauliflower', category: 'food', difficulty: 'easy', hint: 'White vegetable with florets', romaji: 'karifurawaa', isHiragana: false, isKatakana: true },
  { japanese: 'セロリ', english: 'celery', category: 'food', difficulty: 'easy', hint: 'Long green stalks with leaves', romaji: 'serori', isHiragana: false, isKatakana: true },
  { japanese: 'レタス', english: 'lettuce', category: 'food', difficulty: 'easy', hint: 'Common salad green', romaji: 'retasu', isHiragana: false, isKatakana: true },
  { japanese: 'さかな', english: 'fish', category: 'food', difficulty: 'easy', hint: 'Common seafood', romaji: 'sakana', isHiragana: true, isKatakana: false },
  { japanese: 'にく', english: 'meat', category: 'food', difficulty: 'easy', hint: 'Animal protein', romaji: 'niku', isHiragana: true, isKatakana: false },
  { japanese: 'ごはん', english: 'rice', category: 'food', difficulty: 'easy', hint: 'Staple Japanese food', romaji: 'gohan', isHiragana: true, isKatakana: false },
  { japanese: 'みず', english: 'water', category: 'food', difficulty: 'easy', hint: 'Essential drink', romaji: 'mizu', isHiragana: true, isKatakana: false },
  { japanese: 'おちゃ', english: 'tea', category: 'food', difficulty: 'easy', hint: 'Traditional Japanese drink', romaji: 'ocha', isHiragana: true, isKatakana: false },
  { japanese: 'コーヒー', english: 'coffee', category: 'food', difficulty: 'easy', hint: 'Popular morning drink', romaji: 'koohii', isHiragana: false, isKatakana: true },
  { japanese: 'パン', english: 'bread', category: 'food', difficulty: 'easy', hint: 'Baked food', romaji: 'pan', isHiragana: false, isKatakana: true },
  { japanese: 'ケーキ', english: 'cake', category: 'food', difficulty: 'easy', hint: 'Sweet dessert', romaji: 'keeki', isHiragana: false, isKatakana: true },
  { japanese: 'アイスクリーム', english: 'ice cream', category: 'food', difficulty: 'easy', hint: 'Frozen dessert', romaji: 'aisukuriimu', isHiragana: false, isKatakana: true },
  { japanese: 'チョコレート', english: 'chocolate', category: 'food', difficulty: 'easy', hint: 'Sweet treat', romaji: 'chokoreeto', isHiragana: false, isKatakana: true },

  // Animals
  { japanese: 'ねこ', english: 'cat', category: 'animals', difficulty: 'easy', hint: 'Common house pet that meows', romaji: 'neko', isHiragana: true, isKatakana: false },
  { japanese: 'いぬ', english: 'dog', category: 'animals', difficulty: 'easy', hint: 'Man\'s best friend', romaji: 'inu', isHiragana: true, isKatakana: false },
  { japanese: 'うさぎ', english: 'rabbit', category: 'animals', difficulty: 'easy', hint: 'Long-eared hopping animal', romaji: 'usagi', isHiragana: true, isKatakana: false },
  { japanese: 'ねずみ', english: 'mouse', category: 'animals', difficulty: 'easy', hint: 'Small rodent', romaji: 'nezumi', isHiragana: true, isKatakana: false },
  { japanese: 'とり', english: 'bird', category: 'animals', difficulty: 'easy', hint: 'Flying animal with feathers', romaji: 'tori', isHiragana: true, isKatakana: false },
  { japanese: 'パンダ', english: 'panda', category: 'animals', difficulty: 'easy', hint: 'Black and white bear from China', romaji: 'panda', isHiragana: false, isKatakana: true },
  { japanese: 'コアラ', english: 'koala', category: 'animals', difficulty: 'easy', hint: 'Australian tree-dwelling marsupial', romaji: 'koara', isHiragana: false, isKatakana: true },
  { japanese: 'カンガルー', english: 'kangaroo', category: 'animals', difficulty: 'easy', hint: 'Australian jumping marsupial', romaji: 'kangaruu', isHiragana: false, isKatakana: true },
  { japanese: 'ペンギン', english: 'penguin', category: 'animals', difficulty: 'easy', hint: 'Flightless bird that lives in cold regions', romaji: 'pengin', isHiragana: false, isKatakana: true },
  { japanese: 'ぞう', english: 'elephant', category: 'animals', difficulty: 'easy', hint: 'Large animal with a trunk', romaji: 'zou', isHiragana: true, isKatakana: false },
  { japanese: 'チンパンジー', english: 'chimpanzee', category: 'animals', difficulty: 'easy', hint: 'Primate closely related to humans', romaji: 'chinpanjii', isHiragana: false, isKatakana: true },
  { japanese: 'ゴリラ', english: 'gorilla', category: 'animals', difficulty: 'easy', hint: 'Largest living primate', romaji: 'gorira', isHiragana: false, isKatakana: true },
  { japanese: 'カバ', english: 'hippopotamus', category: 'animals', difficulty: 'easy', hint: 'Large African mammal that lives in water', romaji: 'kaba', isHiragana: false, isKatakana: true },
  { japanese: 'キリン', english: 'giraffe', category: 'animals', difficulty: 'easy', hint: 'Tall animal with a long neck', romaji: 'kirin', isHiragana: false, isKatakana: true },
  { japanese: 'サイ', english: 'rhinoceros', category: 'animals', difficulty: 'easy', hint: 'Large animal with a horn on its nose', romaji: 'sai', isHiragana: false, isKatakana: true },
  { japanese: 'くま', english: 'bear', category: 'animals', difficulty: 'easy', hint: 'Large forest animal', romaji: 'kuma', isHiragana: true, isKatakana: false },
  { japanese: 'きつね', english: 'fox', category: 'animals', difficulty: 'easy', hint: 'Clever forest animal', romaji: 'kitsune', isHiragana: true, isKatakana: false },
  { japanese: 'たぬき', english: 'raccoon dog', category: 'animals', difficulty: 'easy', hint: 'Japanese forest animal', romaji: 'tanuki', isHiragana: true, isKatakana: false },
  { japanese: 'さる', english: 'monkey', category: 'animals', difficulty: 'easy', hint: 'Tree-dwelling primate', romaji: 'saru', isHiragana: true, isKatakana: false },
  { japanese: 'しか', english: 'deer', category: 'animals', difficulty: 'easy', hint: 'Forest animal with antlers', romaji: 'shika', isHiragana: true, isKatakana: false },

  // Colors
  { japanese: 'あか', english: 'red', category: 'colors', difficulty: 'easy', hint: 'Color of blood', romaji: 'aka', isHiragana: true, isKatakana: false },
  { japanese: 'あお', english: 'blue', category: 'colors', difficulty: 'easy', hint: 'Color of the sky', romaji: 'ao', isHiragana: true, isKatakana: false },
  { japanese: 'きいろ', english: 'yellow', category: 'colors', difficulty: 'easy', hint: 'Color of bananas', romaji: 'kiiro', isHiragana: true, isKatakana: false },
  { japanese: 'しろ', english: 'white', category: 'colors', difficulty: 'easy', hint: 'Color of snow', romaji: 'shiro', isHiragana: true, isKatakana: false },
  { japanese: 'くろ', english: 'black', category: 'colors', difficulty: 'easy', hint: 'Color of night', romaji: 'kuro', isHiragana: true, isKatakana: false },
  { japanese: 'みどり', english: 'green', category: 'colors', difficulty: 'easy', hint: 'Color of grass', romaji: 'midori', isHiragana: true, isKatakana: false },
  { japanese: 'むらさき', english: 'purple', category: 'colors', difficulty: 'easy', hint: 'Color of grapes', romaji: 'murasaki', isHiragana: true, isKatakana: false },
  { japanese: 'オレンジ', english: 'orange', category: 'colors', difficulty: 'easy', hint: 'Color of the fruit', romaji: 'orenji', isHiragana: false, isKatakana: true },
  { japanese: 'ちゃいろ', english: 'brown', category: 'colors', difficulty: 'easy', hint: 'Color of chocolate', romaji: 'chairo', isHiragana: true, isKatakana: false },
  { japanese: 'ピンク', english: 'pink', category: 'colors', difficulty: 'easy', hint: 'Light red color', romaji: 'pinku', isHiragana: false, isKatakana: true },
  { japanese: 'グレー', english: 'gray', category: 'colors', difficulty: 'easy', hint: 'Color between black and white', romaji: 'guree', isHiragana: false, isKatakana: true },
  { japanese: 'ベージュ', english: 'beige', category: 'colors', difficulty: 'easy', hint: 'Light brown color', romaji: 'beeju', isHiragana: false, isKatakana: true },
  { japanese: 'ゴールド', english: 'gold', category: 'colors', difficulty: 'easy', hint: 'Color of precious metal', romaji: 'goorudo', isHiragana: false, isKatakana: true },
  { japanese: 'シルバー', english: 'silver', category: 'colors', difficulty: 'easy', hint: 'Color of coins', romaji: 'shirubaa', isHiragana: false, isKatakana: true },
  { japanese: 'マロン', english: 'maroon', category: 'colors', difficulty: 'easy', hint: 'Dark red color', romaji: 'maron', isHiragana: false, isKatakana: true },
  { japanese: 'クリーム', english: 'cream', category: 'colors', difficulty: 'easy', hint: 'Light yellow-white color', romaji: 'kuriimu', isHiragana: false, isKatakana: true },
  { japanese: 'ネイビー', english: 'navy', category: 'colors', difficulty: 'easy', hint: 'Dark blue color', romaji: 'neibii', isHiragana: false, isKatakana: true },
  { japanese: 'ターコイズ', english: 'turquoise', category: 'colors', difficulty: 'easy', hint: 'Blue-green color', romaji: 'taakoizu', isHiragana: false, isKatakana: true },
  { japanese: 'ラベンダー', english: 'lavender', category: 'colors', difficulty: 'easy', hint: 'Light purple color', romaji: 'rabendaa', isHiragana: false, isKatakana: true },
  { japanese: 'コーラル', english: 'coral', category: 'colors', difficulty: 'easy', hint: 'Pink-orange color', romaji: 'kooraru', isHiragana: false, isKatakana: true },

  // Numbers
  { japanese: 'いち', english: 'one', category: 'numbers', difficulty: 'easy', hint: 'First number', romaji: 'ichi', isHiragana: true, isKatakana: false },
  { japanese: 'に', english: 'two', category: 'numbers', difficulty: 'easy', hint: 'Second number', romaji: 'ni', isHiragana: true, isKatakana: false },
  { japanese: 'さん', english: 'three', category: 'numbers', difficulty: 'easy', hint: 'Third number', romaji: 'san', isHiragana: true, isKatakana: false },
  { japanese: 'よん', english: 'four', category: 'numbers', difficulty: 'easy', hint: 'Fourth number', romaji: 'yon', isHiragana: true, isKatakana: false },
  { japanese: 'ご', english: 'five', category: 'numbers', difficulty: 'easy', hint: 'Fifth number', romaji: 'go', isHiragana: true, isKatakana: false },
  { japanese: 'ろく', english: 'six', category: 'numbers', difficulty: 'easy', hint: 'Sixth number', romaji: 'roku', isHiragana: true, isKatakana: false },
  { japanese: 'なな', english: 'seven', category: 'numbers', difficulty: 'easy', hint: 'Seventh number', romaji: 'nana', isHiragana: true, isKatakana: false },
  { japanese: 'はち', english: 'eight', category: 'numbers', difficulty: 'easy', hint: 'Eighth number', romaji: 'hachi', isHiragana: true, isKatakana: false },
  { japanese: 'きゅう', english: 'nine', category: 'numbers', difficulty: 'easy', hint: 'Ninth number', romaji: 'kyuu', isHiragana: true, isKatakana: false },
  { japanese: 'じゅう', english: 'ten', category: 'numbers', difficulty: 'easy', hint: 'Tenth number', romaji: 'juu', isHiragana: true, isKatakana: false },
  { japanese: 'じゅういち', english: 'eleven', category: 'numbers', difficulty: 'easy', hint: 'Ten plus one', romaji: 'juuichi', isHiragana: true, isKatakana: false },
  { japanese: 'じゅうに', english: 'twelve', category: 'numbers', difficulty: 'easy', hint: 'Ten plus two', romaji: 'juuni', isHiragana: true, isKatakana: false },
  { japanese: 'にじゅう', english: 'twenty', category: 'numbers', difficulty: 'easy', hint: 'Two tens', romaji: 'nijuu', isHiragana: true, isKatakana: false },
  { japanese: 'ひゃく', english: 'hundred', category: 'numbers', difficulty: 'easy', hint: 'Ten tens', romaji: 'hyaku', isHiragana: true, isKatakana: false },
  { japanese: 'せん', english: 'thousand', category: 'numbers', difficulty: 'easy', hint: 'Ten hundreds', romaji: 'sen', isHiragana: true, isKatakana: false },
  { japanese: 'にじゅういち', english: 'twenty-one', category: 'numbers', difficulty: 'easy', hint: 'Two tens plus one', romaji: 'nijuuichi', isHiragana: true, isKatakana: false },
  { japanese: 'にじゅうに', english: 'twenty-two', category: 'numbers', difficulty: 'easy', hint: 'Two tens plus two', romaji: 'nijuuni', isHiragana: true, isKatakana: false },
  { japanese: 'さんじゅう', english: 'thirty', category: 'numbers', difficulty: 'easy', hint: 'Three tens', romaji: 'sanjuu', isHiragana: true, isKatakana: false },
  { japanese: 'よんじゅう', english: 'forty', category: 'numbers', difficulty: 'easy', hint: 'Four tens', romaji: 'yonjuu', isHiragana: true, isKatakana: false },
  { japanese: 'ごじゅう', english: 'fifty', category: 'numbers', difficulty: 'easy', hint: 'Five tens', romaji: 'gojuu', isHiragana: true, isKatakana: false },

  // ... continue with all other categories, setting difficulty to 'easy' for all words ...

  // Hiragana (already set to 'easy')
  // ... existing hiragana entries ...

  // Katakana (already set to 'easy')
  // ... existing katakana entries ...
]; 