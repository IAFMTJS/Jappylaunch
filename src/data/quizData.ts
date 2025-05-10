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
}

export const quizWords: QuizWord[] = [
  // Food
  { japanese: 'りんご', english: 'apple', category: 'food', difficulty: 'easy', hint: 'A common red fruit', romaji: 'ringo' },
  { japanese: 'バナナ', english: 'banana', category: 'food', difficulty: 'easy', hint: 'Yellow curved fruit', romaji: 'banana' },
  { japanese: 'みかん', english: 'mandarin', category: 'food', difficulty: 'easy', hint: 'Small orange citrus fruit', romaji: 'mikan' },
  { japanese: 'ぶどう', english: 'grape', category: 'food', difficulty: 'easy', hint: 'Small round fruits that grow in clusters', romaji: 'budou' },
  { japanese: 'いちご', english: 'strawberry', category: 'food', difficulty: 'easy', hint: 'Red fruit with seeds on the outside', romaji: 'ichigo' },
  { japanese: 'トマト', english: 'tomato', category: 'food', difficulty: 'easy', hint: 'Red fruit often used in salads', romaji: 'tomato' },
  { japanese: 'にんじん', english: 'carrot', category: 'food', difficulty: 'easy', hint: 'Orange root vegetable', romaji: 'ninjin' },
  { japanese: 'ピーマン', english: 'bell pepper', category: 'food', difficulty: 'easy', hint: 'Comes in green, red, and yellow', romaji: 'piiman' },
  { japanese: 'なす', english: 'eggplant', category: 'food', difficulty: 'easy', hint: 'Purple vegetable', romaji: 'nasu' },
  { japanese: 'キャベツ', english: 'cabbage', category: 'food', difficulty: 'easy', hint: 'Round leafy vegetable', romaji: 'kyabetsu' },
  { japanese: 'ブロッコリー', english: 'broccoli', category: 'food', difficulty: 'easy', hint: 'Green vegetable with small florets', romaji: 'burokkorii' },
  { japanese: 'アスパラガス', english: 'asparagus', category: 'food', difficulty: 'easy', hint: 'Long green stalks', romaji: 'asuparagasu' },
  { japanese: 'カリフラワー', english: 'cauliflower', category: 'food', difficulty: 'easy', hint: 'White vegetable with florets', romaji: 'karifurawaa' },
  { japanese: 'セロリ', english: 'celery', category: 'food', difficulty: 'easy', hint: 'Long green stalks with leaves', romaji: 'serori' },
  { japanese: 'レタス', english: 'lettuce', category: 'food', difficulty: 'easy', hint: 'Common salad green', romaji: 'retasu' },
  { japanese: 'さかな', english: 'fish', category: 'food', difficulty: 'easy', hint: 'Common seafood', romaji: 'sakana' },
  { japanese: 'にく', english: 'meat', category: 'food', difficulty: 'easy', hint: 'Animal protein', romaji: 'niku' },
  { japanese: 'ごはん', english: 'rice', category: 'food', difficulty: 'easy', hint: 'Staple Japanese food', romaji: 'gohan' },
  { japanese: 'みず', english: 'water', category: 'food', difficulty: 'easy', hint: 'Essential drink', romaji: 'mizu' },
  { japanese: 'おちゃ', english: 'tea', category: 'food', difficulty: 'easy', hint: 'Traditional Japanese drink', romaji: 'ocha' },
  { japanese: 'コーヒー', english: 'coffee', category: 'food', difficulty: 'easy', hint: 'Popular morning drink', romaji: 'koohii' },
  { japanese: 'パン', english: 'bread', category: 'food', difficulty: 'easy', hint: 'Baked food', romaji: 'pan' },
  { japanese: 'ケーキ', english: 'cake', category: 'food', difficulty: 'easy', hint: 'Sweet dessert', romaji: 'keeki' },
  { japanese: 'アイスクリーム', english: 'ice cream', category: 'food', difficulty: 'easy', hint: 'Frozen dessert', romaji: 'aisukuriimu' },
  { japanese: 'チョコレート', english: 'chocolate', category: 'food', difficulty: 'easy', hint: 'Sweet treat', romaji: 'chokoreeto' },

  // Animals
  { japanese: 'ねこ', english: 'cat', category: 'animals', difficulty: 'easy', hint: 'Common house pet that meows', romaji: 'neko' },
  { japanese: 'いぬ', english: 'dog', category: 'animals', difficulty: 'easy', hint: 'Man\'s best friend', romaji: 'inu' },
  { japanese: 'うさぎ', english: 'rabbit', category: 'animals', difficulty: 'easy', hint: 'Long-eared hopping animal', romaji: 'usagi' },
  { japanese: 'ねずみ', english: 'mouse', category: 'animals', difficulty: 'easy', hint: 'Small rodent', romaji: 'nezumi' },
  { japanese: 'とり', english: 'bird', category: 'animals', difficulty: 'easy', hint: 'Flying animal with feathers', romaji: 'tori' },
  { japanese: 'パンダ', english: 'panda', category: 'animals', difficulty: 'easy', hint: 'Black and white bear from China', romaji: 'panda' },
  { japanese: 'コアラ', english: 'koala', category: 'animals', difficulty: 'easy', hint: 'Australian tree-dwelling marsupial', romaji: 'koara' },
  { japanese: 'カンガルー', english: 'kangaroo', category: 'animals', difficulty: 'easy', hint: 'Australian jumping marsupial', romaji: 'kangaruu' },
  { japanese: 'ペンギン', english: 'penguin', category: 'animals', difficulty: 'easy', hint: 'Flightless bird that lives in cold regions', romaji: 'pengin' },
  { japanese: 'ぞう', english: 'elephant', category: 'animals', difficulty: 'easy', hint: 'Large animal with a trunk', romaji: 'zou' },
  { japanese: 'チンパンジー', english: 'chimpanzee', category: 'animals', difficulty: 'easy', hint: 'Primate closely related to humans', romaji: 'chinpanjii' },
  { japanese: 'ゴリラ', english: 'gorilla', category: 'animals', difficulty: 'easy', hint: 'Largest living primate', romaji: 'gorira' },
  { japanese: 'カバ', english: 'hippopotamus', category: 'animals', difficulty: 'easy', hint: 'Large African mammal that lives in water', romaji: 'kaba' },
  { japanese: 'キリン', english: 'giraffe', category: 'animals', difficulty: 'easy', hint: 'Tall animal with a long neck', romaji: 'kirin' },
  { japanese: 'サイ', english: 'rhinoceros', category: 'animals', difficulty: 'easy', hint: 'Large animal with a horn on its nose', romaji: 'sai' },
  { japanese: 'くま', english: 'bear', category: 'animals', difficulty: 'easy', hint: 'Large forest animal', romaji: 'kuma' },
  { japanese: 'きつね', english: 'fox', category: 'animals', difficulty: 'easy', hint: 'Clever forest animal', romaji: 'kitsune' },
  { japanese: 'たぬき', english: 'raccoon dog', category: 'animals', difficulty: 'easy', hint: 'Japanese forest animal', romaji: 'tanuki' },
  { japanese: 'さる', english: 'monkey', category: 'animals', difficulty: 'easy', hint: 'Tree-dwelling primate', romaji: 'saru' },
  { japanese: 'しか', english: 'deer', category: 'animals', difficulty: 'easy', hint: 'Forest animal with antlers', romaji: 'shika' },

  // Colors
  { japanese: 'あか', english: 'red', category: 'colors', difficulty: 'easy', hint: 'Color of blood', romaji: 'aka' },
  { japanese: 'あお', english: 'blue', category: 'colors', difficulty: 'easy', hint: 'Color of the sky', romaji: 'ao' },
  { japanese: 'きいろ', english: 'yellow', category: 'colors', difficulty: 'easy', hint: 'Color of bananas', romaji: 'kiiro' },
  { japanese: 'しろ', english: 'white', category: 'colors', difficulty: 'easy', hint: 'Color of snow', romaji: 'shiro' },
  { japanese: 'くろ', english: 'black', category: 'colors', difficulty: 'easy', hint: 'Color of night', romaji: 'kuro' },
  { japanese: 'みどり', english: 'green', category: 'colors', difficulty: 'easy', hint: 'Color of grass', romaji: 'midori' },
  { japanese: 'むらさき', english: 'purple', category: 'colors', difficulty: 'easy', hint: 'Color of grapes', romaji: 'murasaki' },
  { japanese: 'オレンジ', english: 'orange', category: 'colors', difficulty: 'easy', hint: 'Color of the fruit', romaji: 'orenji' },
  { japanese: 'ちゃいろ', english: 'brown', category: 'colors', difficulty: 'easy', hint: 'Color of chocolate', romaji: 'chairo' },
  { japanese: 'ピンク', english: 'pink', category: 'colors', difficulty: 'easy', hint: 'Light red color', romaji: 'pinku' },
  { japanese: 'グレー', english: 'gray', category: 'colors', difficulty: 'easy', hint: 'Color between black and white', romaji: 'guree' },
  { japanese: 'ベージュ', english: 'beige', category: 'colors', difficulty: 'easy', hint: 'Light brown color', romaji: 'beeju' },
  { japanese: 'ゴールド', english: 'gold', category: 'colors', difficulty: 'easy', hint: 'Color of precious metal', romaji: 'goorudo' },
  { japanese: 'シルバー', english: 'silver', category: 'colors', difficulty: 'easy', hint: 'Color of coins', romaji: 'shirubaa' },
  { japanese: 'マロン', english: 'maroon', category: 'colors', difficulty: 'easy', hint: 'Dark red color', romaji: 'maron' },
  { japanese: 'クリーム', english: 'cream', category: 'colors', difficulty: 'easy', hint: 'Light yellow-white color', romaji: 'kuriimu' },
  { japanese: 'ネイビー', english: 'navy', category: 'colors', difficulty: 'easy', hint: 'Dark blue color', romaji: 'neibii' },
  { japanese: 'ターコイズ', english: 'turquoise', category: 'colors', difficulty: 'easy', hint: 'Blue-green color', romaji: 'taakoizu' },
  { japanese: 'ラベンダー', english: 'lavender', category: 'colors', difficulty: 'easy', hint: 'Light purple color', romaji: 'rabendaa' },
  { japanese: 'コーラル', english: 'coral', category: 'colors', difficulty: 'easy', hint: 'Pink-orange color', romaji: 'kooraru' },

  // Numbers
  { japanese: 'いち', english: 'one', category: 'numbers', difficulty: 'easy', hint: 'First number', romaji: 'ichi' },
  { japanese: 'に', english: 'two', category: 'numbers', difficulty: 'easy', hint: 'Second number', romaji: 'ni' },
  { japanese: 'さん', english: 'three', category: 'numbers', difficulty: 'easy', hint: 'Third number', romaji: 'san' },
  { japanese: 'よん', english: 'four', category: 'numbers', difficulty: 'easy', hint: 'Fourth number', romaji: 'yon' },
  { japanese: 'ご', english: 'five', category: 'numbers', difficulty: 'easy', hint: 'Fifth number', romaji: 'go' },
  { japanese: 'ろく', english: 'six', category: 'numbers', difficulty: 'easy', hint: 'Sixth number', romaji: 'roku' },
  { japanese: 'なな', english: 'seven', category: 'numbers', difficulty: 'easy', hint: 'Seventh number', romaji: 'nana' },
  { japanese: 'はち', english: 'eight', category: 'numbers', difficulty: 'easy', hint: 'Eighth number', romaji: 'hachi' },
  { japanese: 'きゅう', english: 'nine', category: 'numbers', difficulty: 'easy', hint: 'Ninth number', romaji: 'kyuu' },
  { japanese: 'じゅう', english: 'ten', category: 'numbers', difficulty: 'easy', hint: 'Tenth number', romaji: 'juu' },
  { japanese: 'じゅういち', english: 'eleven', category: 'numbers', difficulty: 'easy', hint: 'Ten plus one', romaji: 'juuichi' },
  { japanese: 'じゅうに', english: 'twelve', category: 'numbers', difficulty: 'easy', hint: 'Ten plus two', romaji: 'juuni' },
  { japanese: 'にじゅう', english: 'twenty', category: 'numbers', difficulty: 'easy', hint: 'Two tens', romaji: 'nijuu' },
  { japanese: 'ひゃく', english: 'hundred', category: 'numbers', difficulty: 'easy', hint: 'Ten tens', romaji: 'hyaku' },
  { japanese: 'せん', english: 'thousand', category: 'numbers', difficulty: 'easy', hint: 'Ten hundreds', romaji: 'sen' },
  { japanese: 'にじゅういち', english: 'twenty-one', category: 'numbers', difficulty: 'easy', hint: 'Two tens plus one', romaji: 'nijuuichi' },
  { japanese: 'にじゅうに', english: 'twenty-two', category: 'numbers', difficulty: 'easy', hint: 'Two tens plus two', romaji: 'nijuuni' },
  { japanese: 'さんじゅう', english: 'thirty', category: 'numbers', difficulty: 'easy', hint: 'Three tens', romaji: 'sanjuu' },
  { japanese: 'よんじゅう', english: 'forty', category: 'numbers', difficulty: 'easy', hint: 'Four tens', romaji: 'yonjuu' },
  { japanese: 'ごじゅう', english: 'fifty', category: 'numbers', difficulty: 'easy', hint: 'Five tens', romaji: 'gojuu' },

  // ... continue with all other categories, setting difficulty to 'easy' for all words ...

  // Hiragana (already set to 'easy')
  // ... existing hiragana entries ...

  // Katakana (already set to 'easy')
  // ... existing katakana entries ...
]; 