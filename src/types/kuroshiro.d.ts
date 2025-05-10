declare module 'kuroshiro' {
  export default class Kuroshiro {
    init(analyzer: any): Promise<void>;
    convert(text: string, options?: {
      to?: string;
      mode?: string;
      romajiSystem?: string;
      delimiter_start?: string;
      delimiter_end?: string;
    }): Promise<string>;
  }
}

declare module 'kuroshiro-analyzer-kuromoji' {
  export default class KuromojiAnalyzer {
    constructor(options?: {
      dictPath?: string;
      userDictPath?: string;
    });
    init(): Promise<void>;
  }
} 