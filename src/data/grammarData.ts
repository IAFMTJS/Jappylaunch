export type GrammarDifficulty = 'easy' | 'medium' | 'hard';
export type GrammarCategory = 'basic' | 'particles' | 'verbs' | 'adjectives' | 'all';

export interface GrammarExample {
  japanese: string;
  english: string;
  category: GrammarCategory;
  difficulty: GrammarDifficulty;
  pattern: string;
  hint?: string;
}

export const grammarExamples: GrammarExample[] = [
  // Basic Patterns (Easy)
  {
    japanese: 'わたしは がくせい です',
    english: 'I am a student',
    category: 'basic',
    difficulty: 'easy',
    pattern: 'Xは Yです',
    hint: 'Basic "is/am/are" pattern'
  },
  {
    japanese: 'これは ほん です',
    english: 'This is a book',
    category: 'basic',
    difficulty: 'easy',
    pattern: 'これは Yです',
    hint: 'Pointing to something close'
  },
  {
    japanese: 'あれは くるま です',
    english: 'That is a car',
    category: 'basic',
    difficulty: 'easy',
    pattern: 'あれは Yです',
    hint: 'Pointing to something far away'
  },
  {
    japanese: 'わたしの なまえは たなか です',
    english: 'My name is Tanaka',
    category: 'basic',
    difficulty: 'easy',
    pattern: 'Xの Yは Zです',
    hint: 'Possession pattern'
  },
  {
    japanese: 'これは にほんごの ほん です',
    english: 'This is a Japanese book',
    category: 'basic',
    difficulty: 'easy',
    pattern: 'Xの Yです',
    hint: 'Describing what kind of thing'
  },
  {
    japanese: 'それは わたしの かばん です',
    english: 'That is my bag',
    category: 'basic',
    difficulty: 'easy',
    pattern: 'それは Xの Yです',
    hint: 'Possession with demonstrative'
  },
  {
    japanese: 'あの ひとは せんせい です',
    english: 'That person is a teacher',
    category: 'basic',
    difficulty: 'easy',
    pattern: 'あの Xは Yです',
    hint: 'Pointing to a person'
  },
  {
    japanese: 'ここは がっこう です',
    english: 'This is a school',
    category: 'basic',
    difficulty: 'easy',
    pattern: 'ここは Xです',
    hint: 'Location demonstrative'
  },
  {
    japanese: 'わたしは にほんじん です',
    english: 'I am Japanese',
    category: 'basic',
    difficulty: 'easy',
    pattern: 'Xは Yです',
    hint: 'Nationality pattern'
  },
  {
    japanese: 'あの みせは レストラン です',
    english: 'That shop is a restaurant',
    category: 'basic',
    difficulty: 'easy',
    pattern: 'あの Xは Yです',
    hint: 'Identifying a place'
  },

  // Particles (Medium)
  {
    japanese: 'わたしは がっこうに いきます',
    english: 'I go to school',
    category: 'particles',
    difficulty: 'medium',
    pattern: 'Xは Yに いきます',
    hint: 'Destination particle に with movement verb'
  },
  {
    japanese: 'ほんを よみます',
    english: 'I read a book',
    category: 'particles',
    difficulty: 'medium',
    pattern: 'Xを Yます',
    hint: 'Direct object particle を'
  },
  {
    japanese: 'えきで ともだちに あいました',
    english: 'I met my friend at the station',
    category: 'particles',
    difficulty: 'medium',
    pattern: 'Xで Yに あいます',
    hint: 'Location particle で and target particle に'
  },
  {
    japanese: 'バスで がっこうに いきます',
    english: 'I go to school by bus',
    category: 'particles',
    difficulty: 'medium',
    pattern: 'Xで Yに いきます',
    hint: 'Method particle で'
  },
  {
    japanese: 'ともだちと えいがを みます',
    english: 'I watch a movie with my friend',
    category: 'particles',
    difficulty: 'medium',
    pattern: 'Xと Yを Zます',
    hint: 'Together with particle と'
  },
  {
    japanese: 'ほんは つくえの うえに あります',
    english: 'The book is on the desk',
    category: 'particles',
    difficulty: 'medium',
    pattern: 'Xは Yの Zに あります',
    hint: 'Location particle に with あります'
  },
  {
    japanese: 'わたしは えいごが わかります',
    english: 'I understand English',
    category: 'particles',
    difficulty: 'medium',
    pattern: 'Xは Yが わかります',
    hint: 'Ability particle が'
  },
  {
    japanese: 'コーヒーも のみます',
    english: 'I also drink coffee',
    category: 'particles',
    difficulty: 'medium',
    pattern: 'Xも Yます',
    hint: 'Also particle も'
  },
  {
    japanese: 'えきから バスで いきます',
    english: 'I go by bus from the station',
    category: 'particles',
    difficulty: 'medium',
    pattern: 'Xから Yで いきます',
    hint: 'Starting point particle から'
  },
  {
    japanese: 'ほんを よんでから ねます',
    english: 'I sleep after reading a book',
    category: 'particles',
    difficulty: 'medium',
    pattern: 'Xを んでから Yます',
    hint: 'After doing something'
  },

  // Verbs (Medium)
  {
    japanese: 'テレビを みています',
    english: 'I am watching TV',
    category: 'verbs',
    difficulty: 'medium',
    pattern: 'Xを ています',
    hint: 'Present continuous form'
  },
  {
    japanese: 'ほんを よみたいです',
    english: 'I want to read a book',
    category: 'verbs',
    difficulty: 'medium',
    pattern: 'Xを たいです',
    hint: 'Want to do something'
  },
  {
    japanese: 'えいがを みに いきます',
    english: 'I go to watch a movie',
    category: 'verbs',
    difficulty: 'medium',
    pattern: 'Xを に いきます',
    hint: 'Purpose of movement'
  },
  {
    japanese: 'たべものは たべません',
    english: 'I don\'t eat food',
    category: 'verbs',
    difficulty: 'medium',
    pattern: 'Xは ません',
    hint: 'Negative form'
  },
  {
    japanese: 'ほんを よみました',
    english: 'I read a book',
    category: 'verbs',
    difficulty: 'medium',
    pattern: 'Xを ました',
    hint: 'Past tense'
  },
  {
    japanese: 'えいがを みたことが あります',
    english: 'I have watched this movie before',
    category: 'verbs',
    difficulty: 'medium',
    pattern: 'Xを たことが あります',
    hint: 'Past experience'
  },
  {
    japanese: 'ほんを よむことが できます',
    english: 'I can read books',
    category: 'verbs',
    difficulty: 'medium',
    pattern: 'Xを ことが できます',
    hint: 'Ability to do something'
  },
  {
    japanese: 'えいがを みましょう',
    english: 'Let\'s watch a movie',
    category: 'verbs',
    difficulty: 'medium',
    pattern: 'Xを ましょう',
    hint: 'Let\'s do something'
  },
  {
    japanese: 'ほんを よみながら コーヒーを のみます',
    english: 'I drink coffee while reading a book',
    category: 'verbs',
    difficulty: 'medium',
    pattern: 'Xを ながら Yを Zます',
    hint: 'Doing two actions simultaneously'
  },
  {
    japanese: 'えいがを みたあとで ねます',
    english: 'I sleep after watching the movie',
    category: 'verbs',
    difficulty: 'medium',
    pattern: 'Xを たあとで Yます',
    hint: 'After doing something'
  },

  // Adjectives (Hard)
  {
    japanese: 'この ほんは おもしろいです',
    english: 'This book is interesting',
    category: 'adjectives',
    difficulty: 'hard',
    pattern: 'この Xは Yいです',
    hint: 'い-adjective in present tense'
  },
  {
    japanese: 'その えいがは たのしかったです',
    english: 'That movie was fun',
    category: 'adjectives',
    difficulty: 'hard',
    pattern: 'その Xは Yかったです',
    hint: 'い-adjective in past tense'
  },
  {
    japanese: 'きれいな はなです',
    english: 'It\'s a beautiful flower',
    category: 'adjectives',
    difficulty: 'hard',
    pattern: 'Xな Yです',
    hint: 'な-adjective modifying a noun'
  },
  {
    japanese: 'この レストランは しずかでした',
    english: 'This restaurant was quiet',
    category: 'adjectives',
    difficulty: 'hard',
    pattern: 'この Xは Yでした',
    hint: 'な-adjective in past tense'
  },
  {
    japanese: 'たかい ビルです',
    english: 'It\'s a tall building',
    category: 'adjectives',
    difficulty: 'hard',
    pattern: 'Xい Yです',
    hint: 'い-adjective modifying a noun'
  },
  {
    japanese: 'この ケーキは あまくて おいしいです',
    english: 'This cake is sweet and delicious',
    category: 'adjectives',
    difficulty: 'hard',
    pattern: 'この Xは Yくて Zいです',
    hint: 'Connecting adjectives with て'
  },
  {
    japanese: 'その えいがは おもしろくないです',
    english: 'That movie is not interesting',
    category: 'adjectives',
    difficulty: 'hard',
    pattern: 'その Xは Yくないです',
    hint: 'Negative い-adjective'
  },
  {
    japanese: 'この レストランは しずかじゃないです',
    english: 'This restaurant is not quiet',
    category: 'adjectives',
    difficulty: 'hard',
    pattern: 'この Xは Yじゃないです',
    hint: 'Negative な-adjective'
  },
  {
    japanese: 'この ほんは おもしろくて やさしいです',
    english: 'This book is interesting and easy',
    category: 'adjectives',
    difficulty: 'hard',
    pattern: 'この Xは Yくて Zいです',
    hint: 'Connecting multiple adjectives'
  },
  {
    japanese: 'その えいがは たのしくて おもしろかったです',
    english: 'That movie was fun and interesting',
    category: 'adjectives',
    difficulty: 'hard',
    pattern: 'その Xは Yくて Zかったです',
    hint: 'Connecting adjectives in past tense'
  }
]; 