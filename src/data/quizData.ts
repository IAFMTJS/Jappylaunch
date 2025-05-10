export type Category = 'food' | 'animals' | 'colors' | 'numbers' | 'family' | 'weather' | 'time' | 
  'transportation' | 'clothing' | 'body' | 'emotions' | 'school' | 'work' | 'hobbies' | 'nature' | 
  'house' | 'city' | 'technology' | 'health' | 'all';

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
  // Food (Easy)
  { japanese: 'りんご', english: 'apple', category: 'food', difficulty: 'easy', hint: 'A common red fruit', romaji: 'ringo' },
  { japanese: 'バナナ', english: 'banana', category: 'food', difficulty: 'easy', hint: 'Yellow curved fruit', romaji: 'banana' },
  { japanese: 'みかん', english: 'mandarin', category: 'food', difficulty: 'easy', hint: 'Small orange citrus fruit', romaji: 'mikan' },
  { japanese: 'ぶどう', english: 'grape', category: 'food', difficulty: 'easy', hint: 'Small round fruits that grow in clusters', romaji: 'budou' },
  { japanese: 'いちご', english: 'strawberry', category: 'food', difficulty: 'easy', hint: 'Red fruit with seeds on the outside', romaji: 'ichigo' },
  
  // Food (Medium)
  { japanese: 'トマト', english: 'tomato', category: 'food', difficulty: 'medium', hint: 'Red fruit often used in salads', romaji: 'tomato' },
  { japanese: 'にんじん', english: 'carrot', category: 'food', difficulty: 'medium', hint: 'Orange root vegetable', romaji: 'ninjin' },
  { japanese: 'ピーマン', english: 'bell pepper', category: 'food', difficulty: 'medium', hint: 'Comes in green, red, and yellow', romaji: 'piiman' },
  { japanese: 'なす', english: 'eggplant', category: 'food', difficulty: 'medium', hint: 'Purple vegetable', romaji: 'nasu' },
  { japanese: 'キャベツ', english: 'cabbage', category: 'food', difficulty: 'medium', hint: 'Round leafy vegetable', romaji: 'kyabetsu' },
  
  // Food (Hard)
  { japanese: 'ブロッコリー', english: 'broccoli', category: 'food', difficulty: 'hard', hint: 'Green vegetable with small florets', romaji: 'burokkorii' },
  { japanese: 'アスパラガス', english: 'asparagus', category: 'food', difficulty: 'hard', hint: 'Long green stalks', romaji: 'asuparagasu' },
  { japanese: 'カリフラワー', english: 'cauliflower', category: 'food', difficulty: 'hard', hint: 'White vegetable with florets', romaji: 'karifurawaa' },
  { japanese: 'セロリ', english: 'celery', category: 'food', difficulty: 'hard', hint: 'Long green stalks with leaves', romaji: 'serori' },
  { japanese: 'レタス', english: 'lettuce', category: 'food', difficulty: 'hard', hint: 'Common salad green', romaji: 'retasu' },

  // Food (Additional)
  { japanese: 'さかな', english: 'fish', category: 'food', difficulty: 'easy', hint: 'Common seafood', romaji: 'sakana' },
  { japanese: 'にく', english: 'meat', category: 'food', difficulty: 'easy', hint: 'Animal protein', romaji: 'niku' },
  { japanese: 'ごはん', english: 'rice', category: 'food', difficulty: 'easy', hint: 'Staple Japanese food', romaji: 'gohan' },
  { japanese: 'みず', english: 'water', category: 'food', difficulty: 'easy', hint: 'Essential drink', romaji: 'mizu' },
  { japanese: 'おちゃ', english: 'tea', category: 'food', difficulty: 'easy', hint: 'Traditional Japanese drink', romaji: 'ocha' },
  { japanese: 'コーヒー', english: 'coffee', category: 'food', difficulty: 'medium', hint: 'Popular morning drink', romaji: 'koohii' },
  { japanese: 'パン', english: 'bread', category: 'food', difficulty: 'medium', hint: 'Baked food', romaji: 'pan' },
  { japanese: 'ケーキ', english: 'cake', category: 'food', difficulty: 'medium', hint: 'Sweet dessert', romaji: 'keeki' },
  { japanese: 'アイスクリーム', english: 'ice cream', category: 'food', difficulty: 'medium', hint: 'Frozen dessert', romaji: 'aisukuriimu' },
  { japanese: 'チョコレート', english: 'chocolate', category: 'food', difficulty: 'medium', hint: 'Sweet treat', romaji: 'chokoreeto' },

  // Animals (Easy)
  { japanese: 'ねこ', english: 'cat', category: 'animals', difficulty: 'easy', hint: 'Common house pet that meows', romaji: 'neko' },
  { japanese: 'いぬ', english: 'dog', category: 'animals', difficulty: 'easy', hint: 'Man\'s best friend', romaji: 'inu' },
  { japanese: 'うさぎ', english: 'rabbit', category: 'animals', difficulty: 'easy', hint: 'Long-eared hopping animal', romaji: 'usagi' },
  { japanese: 'ねずみ', english: 'mouse', category: 'animals', difficulty: 'easy', hint: 'Small rodent', romaji: 'nezumi' },
  { japanese: 'とり', english: 'bird', category: 'animals', difficulty: 'easy', hint: 'Flying animal with feathers', romaji: 'tori' },

  // Animals (Medium)
  { japanese: 'パンダ', english: 'panda', category: 'animals', difficulty: 'medium', hint: 'Black and white bear from China', romaji: 'panda' },
  { japanese: 'コアラ', english: 'koala', category: 'animals', difficulty: 'medium', hint: 'Australian tree-dwelling marsupial', romaji: 'koara' },
  { japanese: 'カンガルー', english: 'kangaroo', category: 'animals', difficulty: 'medium', hint: 'Australian jumping marsupial', romaji: 'kangaruu' },
  { japanese: 'ペンギン', english: 'penguin', category: 'animals', difficulty: 'medium', hint: 'Flightless bird that lives in cold regions', romaji: 'pengin' },
  { japanese: 'ぞう', english: 'elephant', category: 'animals', difficulty: 'medium', hint: 'Large animal with a trunk', romaji: 'zou' },

  // Animals (Hard)
  { japanese: 'チンパンジー', english: 'chimpanzee', category: 'animals', difficulty: 'hard', hint: 'Primate closely related to humans', romaji: 'chinpanjii' },
  { japanese: 'ゴリラ', english: 'gorilla', category: 'animals', difficulty: 'hard', hint: 'Largest living primate', romaji: 'gorira' },
  { japanese: 'カバ', english: 'hippopotamus', category: 'animals', difficulty: 'hard', hint: 'Large African mammal that lives in water', romaji: 'kaba' },
  { japanese: 'キリン', english: 'giraffe', category: 'animals', difficulty: 'hard', hint: 'Tall animal with a long neck', romaji: 'kirin' },
  { japanese: 'サイ', english: 'rhinoceros', category: 'animals', difficulty: 'hard', hint: 'Large animal with a horn on its nose', romaji: 'sai' },

  // Animals (Additional)
  { japanese: 'くま', english: 'bear', category: 'animals', difficulty: 'medium', hint: 'Large forest animal', romaji: 'kuma' },
  { japanese: 'きつね', english: 'fox', category: 'animals', difficulty: 'medium', hint: 'Clever forest animal', romaji: 'kitsune' },
  { japanese: 'たぬき', english: 'raccoon dog', category: 'animals', difficulty: 'medium', hint: 'Japanese forest animal', romaji: 'tanuki' },
  { japanese: 'さる', english: 'monkey', category: 'animals', difficulty: 'medium', hint: 'Tree-dwelling primate', romaji: 'saru' },
  { japanese: 'しか', english: 'deer', category: 'animals', difficulty: 'medium', hint: 'Forest animal with antlers', romaji: 'shika' },

  // Colors (Easy)
  { japanese: 'あか', english: 'red', category: 'colors', difficulty: 'easy', hint: 'Color of blood', romaji: 'aka' },
  { japanese: 'あお', english: 'blue', category: 'colors', difficulty: 'easy', hint: 'Color of the sky', romaji: 'ao' },
  { japanese: 'きいろ', english: 'yellow', category: 'colors', difficulty: 'easy', hint: 'Color of bananas', romaji: 'kiiro' },
  { japanese: 'しろ', english: 'white', category: 'colors', difficulty: 'easy', hint: 'Color of snow', romaji: 'shiro' },
  { japanese: 'くろ', english: 'black', category: 'colors', difficulty: 'easy', hint: 'Color of night', romaji: 'kuro' },

  // Colors (Medium)
  { japanese: 'みどり', english: 'green', category: 'colors', difficulty: 'medium', hint: 'Color of grass', romaji: 'midori' },
  { japanese: 'むらさき', english: 'purple', category: 'colors', difficulty: 'medium', hint: 'Color of grapes', romaji: 'murasaki' },
  { japanese: 'オレンジ', english: 'orange', category: 'colors', difficulty: 'medium', hint: 'Color of the fruit', romaji: 'orenji' },
  { japanese: 'ちゃいろ', english: 'brown', category: 'colors', difficulty: 'medium', hint: 'Color of chocolate', romaji: 'chairo' },
  { japanese: 'ピンク', english: 'pink', category: 'colors', difficulty: 'medium', hint: 'Light red color', romaji: 'pinku' },

  // Colors (Hard)
  { japanese: 'グレー', english: 'gray', category: 'colors', difficulty: 'hard', hint: 'Color between black and white', romaji: 'guree' },
  { japanese: 'ベージュ', english: 'beige', category: 'colors', difficulty: 'hard', hint: 'Light brown color', romaji: 'beeju' },
  { japanese: 'ゴールド', english: 'gold', category: 'colors', difficulty: 'hard', hint: 'Color of precious metal', romaji: 'goorudo' },
  { japanese: 'シルバー', english: 'silver', category: 'colors', difficulty: 'hard', hint: 'Color of coins', romaji: 'shirubaa' },
  { japanese: 'マロン', english: 'maroon', category: 'colors', difficulty: 'hard', hint: 'Dark red color', romaji: 'maron' },

  // Colors (Additional)
  { japanese: 'クリーム', english: 'cream', category: 'colors', difficulty: 'medium', hint: 'Light yellow-white color', romaji: 'kuriimu' },
  { japanese: 'ネイビー', english: 'navy', category: 'colors', difficulty: 'hard', hint: 'Dark blue color', romaji: 'neibii' },
  { japanese: 'ターコイズ', english: 'turquoise', category: 'colors', difficulty: 'hard', hint: 'Blue-green color', romaji: 'taakoizu' },
  { japanese: 'ラベンダー', english: 'lavender', category: 'colors', difficulty: 'hard', hint: 'Light purple color', romaji: 'rabendaa' },
  { japanese: 'コーラル', english: 'coral', category: 'colors', difficulty: 'hard', hint: 'Pink-orange color', romaji: 'kooraru' },

  // Numbers (Easy)
  { japanese: 'いち', english: 'one', category: 'numbers', difficulty: 'easy', hint: 'First number', romaji: 'ichi' },
  { japanese: 'に', english: 'two', category: 'numbers', difficulty: 'easy', hint: 'Second number', romaji: 'ni' },
  { japanese: 'さん', english: 'three', category: 'numbers', difficulty: 'easy', hint: 'Third number', romaji: 'san' },
  { japanese: 'よん', english: 'four', category: 'numbers', difficulty: 'easy', hint: 'Fourth number', romaji: 'yon' },
  { japanese: 'ご', english: 'five', category: 'numbers', difficulty: 'easy', hint: 'Fifth number', romaji: 'go' },

  // Numbers (Medium)
  { japanese: 'ろく', english: 'six', category: 'numbers', difficulty: 'medium', hint: 'Sixth number', romaji: 'roku' },
  { japanese: 'なな', english: 'seven', category: 'numbers', difficulty: 'medium', hint: 'Seventh number', romaji: 'nana' },
  { japanese: 'はち', english: 'eight', category: 'numbers', difficulty: 'medium', hint: 'Eighth number', romaji: 'hachi' },
  { japanese: 'きゅう', english: 'nine', category: 'numbers', difficulty: 'medium', hint: 'Ninth number', romaji: 'kyuu' },
  { japanese: 'じゅう', english: 'ten', category: 'numbers', difficulty: 'medium', hint: 'Tenth number', romaji: 'juu' },

  // Numbers (Hard)
  { japanese: 'じゅういち', english: 'eleven', category: 'numbers', difficulty: 'hard', hint: 'Ten plus one', romaji: 'juuichi' },
  { japanese: 'じゅうに', english: 'twelve', category: 'numbers', difficulty: 'hard', hint: 'Ten plus two', romaji: 'juuni' },
  { japanese: 'にじゅう', english: 'twenty', category: 'numbers', difficulty: 'hard', hint: 'Two tens', romaji: 'nijuu' },
  { japanese: 'ひゃく', english: 'hundred', category: 'numbers', difficulty: 'hard', hint: 'Ten tens', romaji: 'hyaku' },
  { japanese: 'せん', english: 'thousand', category: 'numbers', difficulty: 'hard', hint: 'Ten hundreds', romaji: 'sen' },

  // Numbers (Additional)
  { japanese: 'にじゅういち', english: 'twenty-one', category: 'numbers', difficulty: 'hard', hint: 'Two tens plus one', romaji: 'nijuuichi' },
  { japanese: 'にじゅうに', english: 'twenty-two', category: 'numbers', difficulty: 'hard', hint: 'Two tens plus two', romaji: 'nijuuni' },
  { japanese: 'さんじゅう', english: 'thirty', category: 'numbers', difficulty: 'hard', hint: 'Three tens', romaji: 'sanjuu' },
  { japanese: 'よんじゅう', english: 'forty', category: 'numbers', difficulty: 'hard', hint: 'Four tens', romaji: 'yonjuu' },
  { japanese: 'ごじゅう', english: 'fifty', category: 'numbers', difficulty: 'hard', hint: 'Five tens', romaji: 'gojuu' },

  // Family (Easy)
  { japanese: 'おとうさん', english: 'father', category: 'family', difficulty: 'easy', hint: 'Male parent', romaji: 'otousan' },
  { japanese: 'おかあさん', english: 'mother', category: 'family', difficulty: 'easy', hint: 'Female parent', romaji: 'okaasan' },
  { japanese: 'おにいさん', english: 'older brother', category: 'family', difficulty: 'easy', hint: 'Male sibling who is older', romaji: 'oniisan' },
  { japanese: 'おねえさん', english: 'older sister', category: 'family', difficulty: 'easy', hint: 'Female sibling who is older', romaji: 'oneesan' },
  { japanese: 'いもうと', english: 'younger sister', category: 'family', difficulty: 'easy', hint: 'Female sibling who is younger', romaji: 'imouto' },

  // Family (Medium)
  { japanese: 'おとうと', english: 'younger brother', category: 'family', difficulty: 'medium', hint: 'Male sibling who is younger', romaji: 'otouto' },
  { japanese: 'おじいさん', english: 'grandfather', category: 'family', difficulty: 'medium', hint: 'Father\'s father', romaji: 'ojiisan' },
  { japanese: 'おばあさん', english: 'grandmother', category: 'family', difficulty: 'medium', hint: 'Father\'s mother', romaji: 'obaasan' },
  { japanese: 'おじさん', english: 'uncle', category: 'family', difficulty: 'medium', hint: 'Father\'s brother', romaji: 'ojisan' },
  { japanese: 'おばさん', english: 'aunt', category: 'family', difficulty: 'medium', hint: 'Father\'s sister', romaji: 'obasan' },

  // Family (Hard)
  { japanese: 'いとこ', english: 'cousin', category: 'family', difficulty: 'hard', hint: 'Child of your uncle or aunt', romaji: 'itoko' },
  { japanese: 'めい', english: 'niece', category: 'family', difficulty: 'hard', hint: 'Brother or sister\'s daughter', romaji: 'mei' },
  { japanese: 'おい', english: 'nephew', category: 'family', difficulty: 'hard', hint: 'Brother or sister\'s son', romaji: 'oi' },
  { japanese: 'よめ', english: 'daughter-in-law', category: 'family', difficulty: 'hard', hint: 'Son\'s wife', romaji: 'yome' },
  { japanese: 'むすめ', english: 'daughter', category: 'family', difficulty: 'hard', hint: 'Female child', romaji: 'musume' },

  // Family (Additional)
  { japanese: 'むすこ', english: 'son', category: 'family', difficulty: 'hard', hint: 'Male child', romaji: 'musuko' },
  { japanese: 'よめいり', english: 'bride', category: 'family', difficulty: 'hard', hint: 'Newly married woman', romaji: 'yomeiri' },
  { japanese: 'むこ', english: 'groom', category: 'family', difficulty: 'hard', hint: 'Newly married man', romaji: 'muko' },
  { japanese: 'しんせき', english: 'relative', category: 'family', difficulty: 'hard', hint: 'Family member', romaji: 'shinseki' },
  { japanese: 'かぞく', english: 'family', category: 'family', difficulty: 'medium', hint: 'Group of related people', romaji: 'kazoku' },

  // Weather (Easy)
  { japanese: 'あめ', english: 'rain', category: 'weather', difficulty: 'easy', hint: 'Water falling from the sky', romaji: 'ame' },
  { japanese: 'ゆき', english: 'snow', category: 'weather', difficulty: 'easy', hint: 'Frozen water falling from the sky', romaji: 'yuki' },
  { japanese: 'くもり', english: 'cloudy', category: 'weather', difficulty: 'easy', hint: 'Sky covered with clouds', romaji: 'kumori' },
  { japanese: 'はれ', english: 'sunny', category: 'weather', difficulty: 'easy', hint: 'Clear sky with sun', romaji: 'hare' },
  { japanese: 'かぜ', english: 'wind', category: 'weather', difficulty: 'easy', hint: 'Moving air', romaji: 'kaze' },

  // Weather (Medium)
  { japanese: 'あらし', english: 'storm', category: 'weather', difficulty: 'medium', hint: 'Severe weather with strong winds', romaji: 'arashi' },
  { japanese: 'かみなり', english: 'thunder', category: 'weather', difficulty: 'medium', hint: 'Loud sound during storms', romaji: 'kaminari' },
  { japanese: 'きり', english: 'fog', category: 'weather', difficulty: 'medium', hint: 'Low cloud near the ground', romaji: 'kiri' },
  { japanese: 'つゆ', english: 'rainy season', category: 'weather', difficulty: 'medium', hint: 'Period of heavy rain', romaji: 'tsuyu' },
  { japanese: 'たいふう', english: 'typhoon', category: 'weather', difficulty: 'medium', hint: 'Tropical storm', romaji: 'taifuu' },

  // Weather (Hard)
  { japanese: 'ひょう', english: 'hail', category: 'weather', difficulty: 'hard', hint: 'Frozen rain', romaji: 'hyou' },
  { japanese: 'みぞれ', english: 'sleet', category: 'weather', difficulty: 'hard', hint: 'Mix of rain and snow', romaji: 'mizore' },
  { japanese: 'にわかあめ', english: 'shower', category: 'weather', difficulty: 'hard', hint: 'Brief rain', romaji: 'niwakaame' },
  { japanese: 'あられ', english: 'graupel', category: 'weather', difficulty: 'hard', hint: 'Small snow pellets', romaji: 'arare' },
  { japanese: 'つなみ', english: 'tsunami', category: 'weather', difficulty: 'hard', hint: 'Large ocean wave', romaji: 'tsunami' },

  // Weather (Additional)
  { japanese: 'あられ', english: 'sleet', category: 'weather', difficulty: 'hard', hint: 'Mix of rain and snow', romaji: 'arare' },
  { japanese: 'みぞれ', english: 'sleet', category: 'weather', difficulty: 'hard', hint: 'Wet snow', romaji: 'mizore' },
  { japanese: 'にわかあめ', english: 'shower', category: 'weather', difficulty: 'hard', hint: 'Brief rain', romaji: 'niwakaame' },
  { japanese: 'つなみ', english: 'tsunami', category: 'weather', difficulty: 'hard', hint: 'Large ocean wave', romaji: 'tsunami' },
  { japanese: 'かみなり', english: 'thunder', category: 'weather', difficulty: 'medium', hint: 'Loud sound during storms', romaji: 'kaminari' },

  // Time (Easy)
  { japanese: 'いま', english: 'now', category: 'time', difficulty: 'easy', hint: 'Present moment', romaji: 'ima' },
  { japanese: 'きょう', english: 'today', category: 'time', difficulty: 'easy', hint: 'This day', romaji: 'kyou' },
  { japanese: 'あした', english: 'tomorrow', category: 'time', difficulty: 'easy', hint: 'Next day', romaji: 'ashita' },
  { japanese: 'きのう', english: 'yesterday', category: 'time', difficulty: 'easy', hint: 'Previous day', romaji: 'kinou' },
  { japanese: 'あさ', english: 'morning', category: 'time', difficulty: 'easy', hint: 'Early part of the day', romaji: 'asa' },

  // Time (Medium)
  { japanese: 'ひる', english: 'noon', category: 'time', difficulty: 'medium', hint: 'Middle of the day', romaji: 'hiru' },
  { japanese: 'よる', english: 'night', category: 'time', difficulty: 'medium', hint: 'Dark part of the day', romaji: 'yoru' },
  { japanese: 'こんばん', english: 'tonight', category: 'time', difficulty: 'medium', hint: 'This night', romaji: 'konban' },
  { japanese: 'らいしゅう', english: 'next week', category: 'time', difficulty: 'medium', hint: 'The week after this one', romaji: 'raishuu' },
  { japanese: 'せんしゅう', english: 'last week', category: 'time', difficulty: 'medium', hint: 'The week before this one', romaji: 'senshuu' },

  // Time (Hard)
  { japanese: 'らいげつ', english: 'next month', category: 'time', difficulty: 'hard', hint: 'The month after this one', romaji: 'raigetsu' },
  { japanese: 'せんげつ', english: 'last month', category: 'time', difficulty: 'hard', hint: 'The month before this one', romaji: 'sengetsu' },
  { japanese: 'らいねん', english: 'next year', category: 'time', difficulty: 'hard', hint: 'The year after this one', romaji: 'rainen' },
  { japanese: 'きょねん', english: 'last year', category: 'time', difficulty: 'hard', hint: 'The year before this one', romaji: 'kyonen' },
  { japanese: 'まいにち', english: 'every day', category: 'time', difficulty: 'hard', hint: 'Each day', romaji: 'mainichi' },

  // Time (Additional)
  { japanese: 'いちじ', english: 'one o\'clock', category: 'time', difficulty: 'medium', hint: 'First hour', romaji: 'ichiji' },
  { japanese: 'にじ', english: 'two o\'clock', category: 'time', difficulty: 'medium', hint: 'Second hour', romaji: 'niji' },
  { japanese: 'さんじ', english: 'three o\'clock', category: 'time', difficulty: 'medium', hint: 'Third hour', romaji: 'sanji' },
  { japanese: 'よじ', english: 'four o\'clock', category: 'time', difficulty: 'medium', hint: 'Fourth hour', romaji: 'yoji' },
  { japanese: 'ごじ', english: 'five o\'clock', category: 'time', difficulty: 'medium', hint: 'Fifth hour', romaji: 'goji' },

  // Transportation (Original + Additional)
  { japanese: 'くるま', english: 'car', category: 'transportation', difficulty: 'easy', hint: 'Four-wheeled vehicle', romaji: 'kuruma' },
  { japanese: 'じてんしゃ', english: 'bicycle', category: 'transportation', difficulty: 'easy', hint: 'Two-wheeled vehicle', romaji: 'jitensha' },
  { japanese: 'でんしゃ', english: 'train', category: 'transportation', difficulty: 'easy', hint: 'Rail transportation', romaji: 'densha' },
  { japanese: 'バス', english: 'bus', category: 'transportation', difficulty: 'easy', hint: 'Public transportation', romaji: 'basu' },
  { japanese: 'ひこうき', english: 'airplane', category: 'transportation', difficulty: 'easy', hint: 'Flying vehicle', romaji: 'hikouki' },
  { japanese: 'ふね', english: 'ship', category: 'transportation', difficulty: 'medium', hint: 'Water vehicle', romaji: 'fune' },
  { japanese: 'タクシー', english: 'taxi', category: 'transportation', difficulty: 'medium', hint: 'Hired car', romaji: 'takushii' },
  { japanese: 'バイク', english: 'motorcycle', category: 'transportation', difficulty: 'medium', hint: 'Two-wheeled motor vehicle', romaji: 'baiku' },
  { japanese: 'ヘリコプター', english: 'helicopter', category: 'transportation', difficulty: 'hard', hint: 'Rotating-wing aircraft', romaji: 'herikoputaa' },
  { japanese: 'スペースシャトル', english: 'space shuttle', category: 'transportation', difficulty: 'hard', hint: 'Space vehicle', romaji: 'supeesu shatoru' },
  { japanese: 'トラック', english: 'truck', category: 'transportation', difficulty: 'medium', hint: 'Large vehicle', romaji: 'torakku' },
  { japanese: 'バン', english: 'van', category: 'transportation', difficulty: 'medium', hint: 'Box vehicle', romaji: 'ban' },
  { japanese: 'モーターバイク', english: 'motorcycle', category: 'transportation', difficulty: 'medium', hint: 'Two-wheeled motor vehicle', romaji: 'mootaabaiku' },
  { japanese: 'スクーター', english: 'scooter', category: 'transportation', difficulty: 'medium', hint: 'Small motorcycle', romaji: 'sukuutaa' },
  { japanese: 'トロリーバス', english: 'trolleybus', category: 'transportation', difficulty: 'hard', hint: 'Electric bus', romaji: 'tororiibasu' },
  { japanese: 'モノレール', english: 'monorail', category: 'transportation', difficulty: 'hard', hint: 'Single rail train', romaji: 'monoreeru' },
  { japanese: 'ケーブルカー', english: 'cable car', category: 'transportation', difficulty: 'hard', hint: 'Mountain transport', romaji: 'keeburukaa' },
  { japanese: 'フェリー', english: 'ferry', category: 'transportation', difficulty: 'medium', hint: 'Passenger boat', romaji: 'ferii' },
  { japanese: 'ヨット', english: 'yacht', category: 'transportation', difficulty: 'hard', hint: 'Small boat', romaji: 'yotto' },
  { japanese: 'ジェットき', english: 'jet', category: 'transportation', difficulty: 'hard', hint: 'Fast airplane', romaji: 'jettoki' },

  // Clothing (Original + Additional)
  { japanese: 'シャツ', english: 'shirt', category: 'clothing', difficulty: 'easy', hint: 'Upper body garment', romaji: 'shatsu' },
  { japanese: 'ズボン', english: 'pants', category: 'clothing', difficulty: 'easy', hint: 'Lower body garment', romaji: 'zubon' },
  { japanese: 'くつ', english: 'shoes', category: 'clothing', difficulty: 'easy', hint: 'Footwear', romaji: 'kutsu' },
  { japanese: 'ぼうし', english: 'hat', category: 'clothing', difficulty: 'easy', hint: 'Head covering', romaji: 'boushi' },
  { japanese: 'くつした', english: 'socks', category: 'clothing', difficulty: 'easy', hint: 'Foot covering', romaji: 'kutsushita' },
  { japanese: 'コート', english: 'coat', category: 'clothing', difficulty: 'medium', hint: 'Outer garment', romaji: 'kooto' },
  { japanese: 'セーター', english: 'sweater', category: 'clothing', difficulty: 'medium', hint: 'Warm upper garment', romaji: 'seetaa' },
  { japanese: 'スカート', english: 'skirt', category: 'clothing', difficulty: 'medium', hint: 'Lower body garment for women', romaji: 'sukaato' },
  { japanese: 'ネクタイ', english: 'tie', category: 'clothing', difficulty: 'hard', hint: 'Neck accessory', romaji: 'nekutai' },
  { japanese: 'ベルト', english: 'belt', category: 'clothing', difficulty: 'hard', hint: 'Waist accessory', romaji: 'beruto' },
  { japanese: 'ジャケット', english: 'jacket', category: 'clothing', difficulty: 'medium', hint: 'Outer garment', romaji: 'jaketto' },
  { japanese: 'マフラー', english: 'scarf', category: 'clothing', difficulty: 'medium', hint: 'Neck covering', romaji: 'mafuraa' },
  { japanese: 'てぶくろ', english: 'gloves', category: 'clothing', difficulty: 'medium', hint: 'Hand covering', romaji: 'tebukuro' },
  { japanese: 'サンダル', english: 'sandals', category: 'clothing', difficulty: 'medium', hint: 'Summer shoes', romaji: 'sandaru' },
  { japanese: 'ブーツ', english: 'boots', category: 'clothing', difficulty: 'medium', hint: 'Tall shoes', romaji: 'buutsu' },
  { japanese: 'パンツ', english: 'underwear', category: 'clothing', difficulty: 'medium', hint: 'Under garment', romaji: 'pantsu' },
  { japanese: 'ブラジャー', english: 'bra', category: 'clothing', difficulty: 'hard', hint: 'Women\'s undergarment', romaji: 'burajaa' },
  { japanese: 'タイツ', english: 'tights', category: 'clothing', difficulty: 'hard', hint: 'Leg covering', romaji: 'taitsu' },
  { japanese: 'スリッパ', english: 'slippers', category: 'clothing', difficulty: 'medium', hint: 'House shoes', romaji: 'surippa' },
  { japanese: 'レインコート', english: 'raincoat', category: 'clothing', difficulty: 'medium', hint: 'Rain protection', romaji: 'reinkooto' },

  // Body (Original + Additional)
  { japanese: 'あたま', english: 'head', category: 'body', difficulty: 'easy', hint: 'Top of body', romaji: 'atama' },
  { japanese: 'かお', english: 'face', category: 'body', difficulty: 'easy', hint: 'Front of head', romaji: 'kao' },
  { japanese: 'め', english: 'eye', category: 'body', difficulty: 'easy', hint: 'Seeing organ', romaji: 'me' },
  { japanese: 'みみ', english: 'ear', category: 'body', difficulty: 'easy', hint: 'Hearing organ', romaji: 'mimi' },
  { japanese: 'はな', english: 'nose', category: 'body', difficulty: 'easy', hint: 'Smelling organ', romaji: 'hana' },
  { japanese: 'くち', english: 'mouth', category: 'body', difficulty: 'easy', hint: 'Speaking organ', romaji: 'kuchi' },
  { japanese: 'て', english: 'hand', category: 'body', difficulty: 'easy', hint: 'Upper limb', romaji: 'te' },
  { japanese: 'あし', english: 'foot', category: 'body', difficulty: 'easy', hint: 'Lower limb', romaji: 'ashi' },
  { japanese: 'かみ', english: 'hair', category: 'body', difficulty: 'medium', hint: 'Head covering', romaji: 'kami' },
  { japanese: 'は', english: 'tooth', category: 'body', difficulty: 'medium', hint: 'Mouth bone', romaji: 'ha' },
  { japanese: 'うで', english: 'arm', category: 'body', difficulty: 'easy', hint: 'Upper limb', romaji: 'ude' },
  { japanese: 'ひじ', english: 'elbow', category: 'body', difficulty: 'medium', hint: 'Arm joint', romaji: 'hiji' },
  { japanese: 'かた', english: 'shoulder', category: 'body', difficulty: 'medium', hint: 'Upper body joint', romaji: 'kata' },
  { japanese: 'むね', english: 'chest', category: 'body', difficulty: 'medium', hint: 'Upper body front', romaji: 'mune' },
  { japanese: 'おなか', english: 'stomach', category: 'body', difficulty: 'medium', hint: 'Middle body', romaji: 'onaka' },
  { japanese: 'せなか', english: 'back', category: 'body', difficulty: 'medium', hint: 'Body rear', romaji: 'senaka' },
  { japanese: 'ひざ', english: 'knee', category: 'body', difficulty: 'medium', hint: 'Leg joint', romaji: 'hiza' },
  { japanese: 'すね', english: 'shin', category: 'body', difficulty: 'hard', hint: 'Front lower leg', romaji: 'sune' },
  { japanese: 'あしゆび', english: 'toe', category: 'body', difficulty: 'medium', hint: 'Foot digit', romaji: 'ashiyubi' },
  { japanese: 'てゆび', english: 'finger', category: 'body', difficulty: 'medium', hint: 'Hand digit', romaji: 'teyubi' },

  // Emotions (Original + Additional)
  { japanese: 'うれしい', english: 'happy', category: 'emotions', difficulty: 'easy', hint: 'Feeling of joy', romaji: 'ureshii' },
  { japanese: 'かなしい', english: 'sad', category: 'emotions', difficulty: 'easy', hint: 'Feeling of sorrow', romaji: 'kanashii' },
  { japanese: 'おこった', english: 'angry', category: 'emotions', difficulty: 'easy', hint: 'Feeling of anger', romaji: 'okotta' },
  { japanese: 'こわい', english: 'scared', category: 'emotions', difficulty: 'easy', hint: 'Feeling of fear', romaji: 'kowai' },
  { japanese: 'たのしい', english: 'fun', category: 'emotions', difficulty: 'easy', hint: 'Feeling of enjoyment', romaji: 'tanoshii' },
  { japanese: 'つかれた', english: 'tired', category: 'emotions', difficulty: 'medium', hint: 'Feeling of exhaustion', romaji: 'tsukareta' },
  { japanese: 'びっくりした', english: 'surprised', category: 'emotions', difficulty: 'medium', hint: 'Feeling of shock', romaji: 'bikkurishita' },
  { japanese: 'はずかしい', english: 'embarrassed', category: 'emotions', difficulty: 'medium', hint: 'Feeling of shame', romaji: 'hazukashii' },
  { japanese: 'さびしい', english: 'lonely', category: 'emotions', difficulty: 'hard', hint: 'Feeling of solitude', romaji: 'sabishii' },
  { japanese: 'うらやましい', english: 'envious', category: 'emotions', difficulty: 'hard', hint: 'Feeling of jealousy', romaji: 'urayamashii' },
  { japanese: 'おもしろい', english: 'interesting', category: 'emotions', difficulty: 'easy', hint: 'Feeling of interest', romaji: 'omoshiroi' },
  { japanese: 'あんしん', english: 'relieved', category: 'emotions', difficulty: 'medium', hint: 'Feeling of relief', romaji: 'anshin' },
  { japanese: 'しんぱい', english: 'worried', category: 'emotions', difficulty: 'medium', hint: 'Feeling of concern', romaji: 'shinpai' },
  { japanese: 'きもちいい', english: 'pleasant', category: 'emotions', difficulty: 'medium', hint: 'Feeling of comfort', romaji: 'kimochiii' },
  { japanese: 'いらいら', english: 'irritated', category: 'emotions', difficulty: 'medium', hint: 'Feeling of annoyance', romaji: 'iraira' },
  { japanese: 'どきどき', english: 'excited', category: 'emotions', difficulty: 'medium', hint: 'Feeling of excitement', romaji: 'dokidoki' },
  { japanese: 'わくわく', english: 'thrilled', category: 'emotions', difficulty: 'medium', hint: 'Feeling of thrill', romaji: 'wakuwaku' },
  { japanese: 'がっかり', english: 'disappointed', category: 'emotions', difficulty: 'medium', hint: 'Feeling of disappointment', romaji: 'gakkari' },
  { japanese: 'うっとうしい', english: 'depressed', category: 'emotions', difficulty: 'hard', hint: 'Feeling of depression', romaji: 'uttoushii' },
  { japanese: 'きらきら', english: 'sparkling', category: 'emotions', difficulty: 'hard', hint: 'Feeling of sparkle', romaji: 'kirakira' },

  // New Category: School
  { japanese: 'がっこう', english: 'school', category: 'school', difficulty: 'easy', hint: 'Place of learning', romaji: 'gakkou' },
  { japanese: 'せんせい', english: 'teacher', category: 'school', difficulty: 'easy', hint: 'Person who teaches', romaji: 'sensei' },
  { japanese: 'がくせい', english: 'student', category: 'school', difficulty: 'easy', hint: 'Person who learns', romaji: 'gakusei' },
  { japanese: 'ほん', english: 'book', category: 'school', difficulty: 'easy', hint: 'Reading material', romaji: 'hon' },
  { japanese: 'えんぴつ', english: 'pencil', category: 'school', difficulty: 'easy', hint: 'Writing tool', romaji: 'enpitsu' },
  { japanese: 'ノート', english: 'notebook', category: 'school', difficulty: 'easy', hint: 'Writing paper', romaji: 'nooto' },
  { japanese: 'けしゴム', english: 'eraser', category: 'school', difficulty: 'easy', hint: 'Mistake remover', romaji: 'keshigomu' },
  { japanese: 'じゅぎょう', english: 'class', category: 'school', difficulty: 'medium', hint: 'Learning session', romaji: 'jugyou' },
  { japanese: 'テスト', english: 'test', category: 'school', difficulty: 'medium', hint: 'Knowledge check', romaji: 'tesuto' },
  { japanese: 'しゅくだい', english: 'homework', category: 'school', difficulty: 'medium', hint: 'Work done at home', romaji: 'shukudai' },
  { japanese: 'としょかん', english: 'library', category: 'school', difficulty: 'medium', hint: 'Book storage', romaji: 'toshokan' },
  { japanese: 'きょうしつ', english: 'classroom', category: 'school', difficulty: 'medium', hint: 'Learning room', romaji: 'kyoushitsu' },
  { japanese: 'じゅけん', english: 'exam', category: 'school', difficulty: 'hard', hint: 'Important test', romaji: 'juken' },
  { japanese: 'りゅうがく', english: 'study abroad', category: 'school', difficulty: 'hard', hint: 'Learning in another country', romaji: 'ryuugaku' },
  { japanese: 'がくぶ', english: 'faculty', category: 'school', difficulty: 'hard', hint: 'School department', romaji: 'gakubu' },
  { japanese: 'せんもん', english: 'major', category: 'school', difficulty: 'hard', hint: 'Field of study', romaji: 'senmon' },
  { japanese: 'がくい', english: 'academic degree', category: 'school', difficulty: 'hard', hint: 'Educational qualification', romaji: 'gakui' },
  { japanese: 'こうこう', english: 'high school', category: 'school', difficulty: 'medium', hint: 'Secondary education', romaji: 'koukou' },
  { japanese: 'ちゅうがっこう', english: 'middle school', category: 'school', difficulty: 'medium', hint: 'Intermediate education', romaji: 'chuugakkou' },
  { japanese: 'しょうがっこう', english: 'elementary school', category: 'school', difficulty: 'medium', hint: 'Primary education', romaji: 'shougakkou' },

  // New Category: Work
  { japanese: 'しごと', english: 'work', category: 'work', difficulty: 'easy', hint: 'Job or employment', romaji: 'shigoto' },
  { japanese: 'かいしゃ', english: 'company', category: 'work', difficulty: 'easy', hint: 'Business organization', romaji: 'kaisha' },
  { japanese: 'かいぎ', english: 'meeting', category: 'work', difficulty: 'easy', hint: 'Business discussion', romaji: 'kaigi' },
  { japanese: 'プロジェクト', english: 'project', category: 'work', difficulty: 'medium', hint: 'Work assignment', romaji: 'purojekuto' },
  { japanese: 'レポート', english: 'report', category: 'work', difficulty: 'medium', hint: 'Written document', romaji: 'repooto' },
  { japanese: 'プレゼン', english: 'presentation', category: 'work', difficulty: 'medium', hint: 'Information display', romaji: 'purezen' },
  { japanese: 'しゃいん', english: 'employee', category: 'work', difficulty: 'medium', hint: 'Company worker', romaji: 'shain' },
  { japanese: 'ぶちょう', english: 'department head', category: 'work', difficulty: 'hard', hint: 'Section manager', romaji: 'buchou' },
  { japanese: 'しゃちょう', english: 'company president', category: 'work', difficulty: 'hard', hint: 'Company leader', romaji: 'shachou' },
  { japanese: 'やくいん', english: 'executive', category: 'work', difficulty: 'hard', hint: 'Company officer', romaji: 'yakuin' },
  { japanese: 'じむしょ', english: 'office', category: 'work', difficulty: 'medium', hint: 'Work place', romaji: 'jimusho' },
  { japanese: 'デスク', english: 'desk', category: 'work', difficulty: 'easy', hint: 'Work surface', romaji: 'desuku' },
  { japanese: 'パソコン', english: 'computer', category: 'work', difficulty: 'easy', hint: 'Electronic device', romaji: 'pasokon' },
  { japanese: 'プリンター', english: 'printer', category: 'work', difficulty: 'medium', hint: 'Printing device', romaji: 'purintaa' },
  { japanese: 'コピーき', english: 'copier', category: 'work', difficulty: 'medium', hint: 'Copying device', romaji: 'kopiiki' },
  { japanese: 'ファックス', english: 'fax', category: 'work', difficulty: 'hard', hint: 'Document transmission', romaji: 'fakkusu' },
  { japanese: 'メール', english: 'email', category: 'work', difficulty: 'medium', hint: 'Electronic message', romaji: 'meeru' },
  { japanese: 'でんわ', english: 'telephone', category: 'work', difficulty: 'easy', hint: 'Communication device', romaji: 'denwa' },
  { japanese: 'スケジュール', english: 'schedule', category: 'work', difficulty: 'medium', hint: 'Time plan', romaji: 'sukejuuru' },
  { japanese: 'やくそく', english: 'appointment', category: 'work', difficulty: 'medium', hint: 'Scheduled meeting', romaji: 'yakusoku' },

  // New Category: Hobbies
  { japanese: 'スポーツ', english: 'sports', category: 'hobbies', difficulty: 'easy', hint: 'Physical activities', romaji: 'supootsu' },
  { japanese: 'テニス', english: 'tennis', category: 'hobbies', difficulty: 'easy', hint: 'Racket sport', romaji: 'tenisu' },
  { japanese: 'サッカー', english: 'soccer', category: 'hobbies', difficulty: 'easy', hint: 'Ball sport', romaji: 'sakkaa' },
  { japanese: 'バスケットボール', english: 'basketball', category: 'hobbies', difficulty: 'medium', hint: 'Hoop sport', romaji: 'basukettobooru' },
  { japanese: 'スイミング', english: 'swimming', category: 'hobbies', difficulty: 'medium', hint: 'Water sport', romaji: 'suimingu' },
  { japanese: 'ピアノ', english: 'piano', category: 'hobbies', difficulty: 'medium', hint: 'Musical instrument', romaji: 'piano' },
  { japanese: 'ギター', english: 'guitar', category: 'hobbies', difficulty: 'medium', hint: 'String instrument', romaji: 'gitaa' },
  { japanese: 'えいが', english: 'movie', category: 'hobbies', difficulty: 'easy', hint: 'Film entertainment', romaji: 'eiga' },
  { japanese: 'テレビ', english: 'TV', category: 'hobbies', difficulty: 'easy', hint: 'Television', romaji: 'terebi' },
  { japanese: 'ゲーム', english: 'game', category: 'hobbies', difficulty: 'easy', hint: 'Play activity', romaji: 'geemu' },
  { japanese: 'どくしょ', english: 'reading', category: 'hobbies', difficulty: 'medium', hint: 'Book activity', romaji: 'dokusho' },
  { japanese: 'えいご', english: 'drawing', category: 'hobbies', difficulty: 'medium', hint: 'Art activity', romaji: 'eigo' },
  { japanese: 'カメラ', english: 'camera', category: 'hobbies', difficulty: 'medium', hint: 'Photo device', romaji: 'kamera' },
  { japanese: 'りょこう', english: 'travel', category: 'hobbies', difficulty: 'medium', hint: 'Journey activity', romaji: 'ryokou' },
  { japanese: 'りょうり', english: 'cooking', category: 'hobbies', difficulty: 'medium', hint: 'Food preparation', romaji: 'ryouri' },
  { japanese: 'ガーデニング', english: 'gardening', category: 'hobbies', difficulty: 'hard', hint: 'Plant care', romaji: 'gaadeningu' },
  { japanese: 'チェス', english: 'chess', category: 'hobbies', difficulty: 'hard', hint: 'Board game', romaji: 'chesu' },
  { japanese: 'ダンス', english: 'dance', category: 'hobbies', difficulty: 'medium', hint: 'Movement art', romaji: 'dansu' },
  { japanese: 'ヨガ', english: 'yoga', category: 'hobbies', difficulty: 'medium', hint: 'Exercise practice', romaji: 'yoga' },
  { japanese: 'ジョギング', english: 'jogging', category: 'hobbies', difficulty: 'medium', hint: 'Running activity', romaji: 'jogingu' },

  // New Category: Nature
  { japanese: 'やま', english: 'mountain', category: 'nature', difficulty: 'easy', hint: 'High landform', romaji: 'yama' },
  { japanese: 'かわ', english: 'river', category: 'nature', difficulty: 'easy', hint: 'Flowing water', romaji: 'kawa' },
  { japanese: 'うみ', english: 'sea', category: 'nature', difficulty: 'easy', hint: 'Large water body', romaji: 'umi' },
  { japanese: 'もり', english: 'forest', category: 'nature', difficulty: 'easy', hint: 'Tree area', romaji: 'mori' },
  { japanese: 'はな', english: 'flower', category: 'nature', difficulty: 'easy', hint: 'Plant bloom', romaji: 'hana' },
  { japanese: 'き', english: 'tree', category: 'nature', difficulty: 'easy', hint: 'Woody plant', romaji: 'ki' },
  { japanese: 'くさ', english: 'grass', category: 'nature', difficulty: 'easy', hint: 'Ground plant', romaji: 'kusa' },
  { japanese: 'つき', english: 'moon', category: 'nature', difficulty: 'easy', hint: 'Night light', romaji: 'tsuki' },
  { japanese: 'ほし', english: 'star', category: 'nature', difficulty: 'easy', hint: 'Night light', romaji: 'hoshi' },
  { japanese: 'たいよう', english: 'sun', category: 'nature', difficulty: 'medium', hint: 'Day light', romaji: 'taiyou' },
  { japanese: 'かぜ', english: 'wind', category: 'nature', difficulty: 'easy', hint: 'Air movement', romaji: 'kaze' },
  { japanese: 'あめ', english: 'rain', category: 'nature', difficulty: 'easy', hint: 'Water fall', romaji: 'ame' },
  { japanese: 'ゆき', english: 'snow', category: 'nature', difficulty: 'easy', hint: 'Frozen water', romaji: 'yuki' },
  { japanese: 'いけ', english: 'pond', category: 'nature', difficulty: 'medium', hint: 'Small water body', romaji: 'ike' },
  { japanese: 'みずうみ', english: 'lake', category: 'nature', difficulty: 'medium', hint: 'Large water body', romaji: 'mizuumi' },
  { japanese: 'さばく', english: 'desert', category: 'nature', difficulty: 'hard', hint: 'Dry area', romaji: 'sabaku' },
  { japanese: 'しま', english: 'island', category: 'nature', difficulty: 'medium', hint: 'Land in water', romaji: 'shima' },
  { japanese: 'たに', english: 'valley', category: 'nature', difficulty: 'hard', hint: 'Low landform', romaji: 'tani' },
  { japanese: 'いわ', english: 'rock', category: 'nature', difficulty: 'medium', hint: 'Stone formation', romaji: 'iwa' },
  { japanese: 'すな', english: 'sand', category: 'nature', difficulty: 'medium', hint: 'Beach material', romaji: 'suna' },

  // New Category: House
  { japanese: 'いえ', english: 'house', category: 'house', difficulty: 'easy', hint: 'Living place', romaji: 'ie' },
  { japanese: 'へや', english: 'room', category: 'house', difficulty: 'easy', hint: 'House space', romaji: 'heya' },
  { japanese: 'ドア', english: 'door', category: 'house', difficulty: 'easy', hint: 'Room entrance', romaji: 'doa' },
  { japanese: 'まど', english: 'window', category: 'house', difficulty: 'easy', hint: 'Light opening', romaji: 'mado' },
  { japanese: 'いす', english: 'chair', category: 'house', difficulty: 'easy', hint: 'Sitting furniture', romaji: 'isu' },
  { japanese: 'テーブル', english: 'table', category: 'house', difficulty: 'easy', hint: 'Surface furniture', romaji: 'teeburu' },
  { japanese: 'ベッド', english: 'bed', category: 'house', difficulty: 'easy', hint: 'Sleeping furniture', romaji: 'beddo' },
  { japanese: 'たたみ', english: 'tatami', category: 'house', difficulty: 'medium', hint: 'Floor mat', romaji: 'tatami' },
  { japanese: 'カーテン', english: 'curtain', category: 'house', difficulty: 'medium', hint: 'Window covering', romaji: 'kaaten' },
  { japanese: 'でんき', english: 'electricity', category: 'house', difficulty: 'medium', hint: 'Power source', romaji: 'denki' },
  { japanese: 'エアコン', english: 'air conditioner', category: 'house', difficulty: 'medium', hint: 'Temperature control', romaji: 'eakon' },
  { japanese: 'れいぞうこ', english: 'refrigerator', category: 'house', difficulty: 'medium', hint: 'Food storage', romaji: 'reizouko' },
  { japanese: 'せんたくき', english: 'washing machine', category: 'house', difficulty: 'hard', hint: 'Clothes cleaner', romaji: 'sentakuki' },
  { japanese: 'テレビ', english: 'TV', category: 'house', difficulty: 'easy', hint: 'Entertainment device', romaji: 'terebi' },
  { japanese: 'ラジオ', english: 'radio', category: 'house', difficulty: 'medium', hint: 'Audio device', romaji: 'rajio' },
  { japanese: 'でんわ', english: 'telephone', category: 'house', difficulty: 'easy', hint: 'Communication device', romaji: 'denwa' },
  { japanese: 'トイレ', english: 'toilet', category: 'house', difficulty: 'easy', hint: 'Bathroom fixture', romaji: 'toire' },
  { japanese: 'おふろ', english: 'bath', category: 'house', difficulty: 'medium', hint: 'Washing place', romaji: 'ofuro' },
  { japanese: 'キッチン', english: 'kitchen', category: 'house', difficulty: 'medium', hint: 'Cooking room', romaji: 'kicchin' },
  { japanese: 'ダイニング', english: 'dining room', category: 'house', difficulty: 'hard', hint: 'Eating room', romaji: 'dainingu' },

  // New Category: City
  { japanese: 'まち', english: 'town', category: 'city', difficulty: 'easy', hint: 'Urban area', romaji: 'machi' },
  { japanese: 'とし', english: 'city', category: 'city', difficulty: 'easy', hint: 'Large town', romaji: 'toshi' },
  { japanese: 'みち', english: 'street', category: 'city', difficulty: 'easy', hint: 'Road', romaji: 'michi' },
  { japanese: 'こうえん', english: 'park', category: 'city', difficulty: 'easy', hint: 'Public space', romaji: 'kouen' },
  { japanese: 'えき', english: 'station', category: 'city', difficulty: 'easy', hint: 'Train stop', romaji: 'eki' },
  { japanese: 'バスてい', english: 'bus stop', category: 'city', difficulty: 'medium', hint: 'Bus station', romaji: 'basutei' },
  { japanese: 'スーパー', english: 'supermarket', category: 'city', difficulty: 'easy', hint: 'Food store', romaji: 'suupaa' },
  { japanese: 'コンビニ', english: 'convenience store', category: 'city', difficulty: 'medium', hint: 'Small store', romaji: 'konbini' },
  { japanese: 'レストラン', english: 'restaurant', category: 'city', difficulty: 'medium', hint: 'Food place', romaji: 'resutoran' },
  { japanese: 'カフェ', english: 'cafe', category: 'city', difficulty: 'medium', hint: 'Coffee shop', romaji: 'kafe' },
  { japanese: 'びょういん', english: 'hospital', category: 'city', difficulty: 'medium', hint: 'Medical place', romaji: 'byouin' },
  { japanese: 'ゆうびんきょく', english: 'post office', category: 'city', difficulty: 'hard', hint: 'Mail place', romaji: 'yuubinkyoku' },
  { japanese: 'ぎんこう', english: 'bank', category: 'city', difficulty: 'medium', hint: 'Money place', romaji: 'ginkou' },
  { japanese: 'としょかん', english: 'library', category: 'city', difficulty: 'medium', hint: 'Book place', romaji: 'toshokan' },
  { japanese: 'びじゅつかん', english: 'museum', category: 'city', difficulty: 'hard', hint: 'Art place', romaji: 'bijutsukan' },
  { japanese: 'えきまえ', english: 'in front of station', category: 'city', difficulty: 'medium', hint: 'Station area', romaji: 'ekimae' },
  { japanese: 'しんこうしゃ', english: 'pedestrian', category: 'city', difficulty: 'hard', hint: 'Person walking', romaji: 'shinkousha' },
  { japanese: 'こうさてん', english: 'intersection', category: 'city', difficulty: 'hard', hint: 'Road crossing', romaji: 'kousaten' },
  { japanese: 'しんごう', english: 'traffic light', category: 'city', difficulty: 'medium', hint: 'Road signal', romaji: 'shingou' },
  { japanese: 'バスてい', english: 'bus terminal', category: 'city', difficulty: 'medium', hint: 'Bus station', romaji: 'basutei' },

  // New Category: Technology
  { japanese: 'パソコン', english: 'computer', category: 'technology', difficulty: 'easy', hint: 'Electronic device', romaji: 'pasokon' },
  { japanese: 'スマートフォン', english: 'smartphone', category: 'technology', difficulty: 'medium', hint: 'Mobile device', romaji: 'sumaatofon' },
  { japanese: 'タブレット', english: 'tablet', category: 'technology', difficulty: 'medium', hint: 'Flat computer', romaji: 'taburetto' },
  { japanese: 'インターネット', english: 'internet', category: 'technology', difficulty: 'medium', hint: 'Web connection', romaji: 'intaanetto' },
  { japanese: 'メール', english: 'email', category: 'technology', difficulty: 'easy', hint: 'Electronic message', romaji: 'meeru' },
  { japanese: 'ウェブサイト', english: 'website', category: 'technology', difficulty: 'medium', hint: 'Online page', romaji: 'webusaito' },
  { japanese: 'アプリ', english: 'app', category: 'technology', difficulty: 'medium', hint: 'Software program', romaji: 'apuri' },
  { japanese: 'カメラ', english: 'camera', category: 'technology', difficulty: 'easy', hint: 'Photo device', romaji: 'kamera' },
  { japanese: 'プリンター', english: 'printer', category: 'technology', difficulty: 'medium', hint: 'Print device', romaji: 'purintaa' },
  { japanese: 'スキャナー', english: 'scanner', category: 'technology', difficulty: 'hard', hint: 'Copy device', romaji: 'sukyanaa' },
  { japanese: 'キーボード', english: 'keyboard', category: 'technology', difficulty: 'easy', hint: 'Input device', romaji: 'kiiboodo' },
  { japanese: 'マウス', english: 'mouse', category: 'technology', difficulty: 'easy', hint: 'Pointer device', romaji: 'mausu' },
  { japanese: 'モニター', english: 'monitor', category: 'technology', difficulty: 'medium', hint: 'Display screen', romaji: 'monitaa' },
  { japanese: 'スピーカー', english: 'speaker', category: 'technology', difficulty: 'medium', hint: 'Sound device', romaji: 'supiikaa' },
  { japanese: 'マイク', english: 'microphone', category: 'technology', difficulty: 'medium', hint: 'Voice device', romaji: 'maiku' },
  { japanese: 'バッテリー', english: 'battery', category: 'technology', difficulty: 'medium', hint: 'Power source', romaji: 'batterii' },
  { japanese: 'ケーブル', english: 'cable', category: 'technology', difficulty: 'medium', hint: 'Connection wire', romaji: 'keeburu' },
  { japanese: 'ワイファイ', english: 'WiFi', category: 'technology', difficulty: 'medium', hint: 'Wireless connection', romaji: 'waifai' },
  { japanese: 'ブルートゥース', english: 'Bluetooth', category: 'technology', difficulty: 'hard', hint: 'Wireless technology', romaji: 'buruutuuusu' },
  { japanese: 'クラウド', english: 'cloud', category: 'technology', difficulty: 'hard', hint: 'Online storage', romaji: 'kuraudo' },

  // New Category: Health
  { japanese: 'けんこう', english: 'health', category: 'health', difficulty: 'easy', hint: 'Well-being', romaji: 'kenkou' },
  { japanese: 'びょうき', english: 'illness', category: 'health', difficulty: 'medium', hint: 'Sickness', romaji: 'byouki' },
  { japanese: 'びょういん', english: 'hospital', category: 'health', difficulty: 'medium', hint: 'Medical place', romaji: 'byouin' },
  { japanese: 'いしゃ', english: 'doctor', category: 'health', difficulty: 'easy', hint: 'Medical professional', romaji: 'isha' },
  { japanese: 'かんごし', english: 'nurse', category: 'health', difficulty: 'medium', hint: 'Medical helper', romaji: 'kangoshi' },
  { japanese: 'くすり', english: 'medicine', category: 'health', difficulty: 'easy', hint: 'Medical treatment', romaji: 'kusuri' },
  { japanese: 'ちゅうしゃ', english: 'injection', category: 'health', difficulty: 'hard', hint: 'Medical shot', romaji: 'chuusha' },
  { japanese: 'けが', english: 'injury', category: 'health', difficulty: 'medium', hint: 'Physical damage', romaji: 'kega' },
  { japanese: 'いたい', english: 'painful', category: 'health', difficulty: 'easy', hint: 'Feeling hurt', romaji: 'itai' },
  { japanese: 'ねつ', english: 'fever', category: 'health', difficulty: 'medium', hint: 'High temperature', romaji: 'netsu' },
  { japanese: 'せき', english: 'cough', category: 'health', difficulty: 'medium', hint: 'Throat clearing', romaji: 'seki' },
  { japanese: 'はなみず', english: 'runny nose', category: 'health', difficulty: 'hard', hint: 'Nose discharge', romaji: 'hanamizu' },
  { japanese: 'ずつう', english: 'headache', category: 'health', difficulty: 'medium', hint: 'Head pain', romaji: 'zutsuu' },
  { japanese: 'はらいた', english: 'stomachache', category: 'health', difficulty: 'hard', hint: 'Stomach pain', romaji: 'haraita' },
  { japanese: 'アレルギー', english: 'allergy', category: 'health', difficulty: 'hard', hint: 'Body reaction', romaji: 'arerugii' },
  { japanese: 'びょういん', english: 'clinic', category: 'health', difficulty: 'medium', hint: 'Small hospital', romaji: 'byouin' },
  { japanese: 'けんこうしんだん', english: 'health check', category: 'health', difficulty: 'hard', hint: 'Medical examination', romaji: 'kenkoushindan' },
  { japanese: 'りょうほう', english: 'treatment', category: 'health', difficulty: 'hard', hint: 'Medical care', romaji: 'ryouhou' },
  { japanese: 'かいふく', english: 'recovery', category: 'health', difficulty: 'hard', hint: 'Getting better', romaji: 'kaifuku' },
  { japanese: 'よぼう', english: 'prevention', category: 'health', difficulty: 'hard', hint: 'Staying healthy', romaji: 'yobou' }
]; 