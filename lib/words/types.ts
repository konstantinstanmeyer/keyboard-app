export type WordEntry = {
    word: string;
    definition: string;
};

export type Result = {
  wpm: number;
  raw: number;
  acc: number;
  correct: number;
  incorrect: number;
  time: number;
  typed: number;
};

export type State = { 
    words: string[]; 
    history: string[]; 
    input: string; 
    wordIndex: number;
};