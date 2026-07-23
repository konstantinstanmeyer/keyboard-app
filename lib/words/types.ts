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

export type SetWord = {
    id: string;
    word: string;
    definition?: string;
}

// type of set the user will soon be able to use
export type SetSource = 'builtin' | 'upload' | 'manual';

export type WordSet = {
  id: string;
  name: string;
  description?: string;
  words: SetWord[];
  source: SetSource;
  readOnly?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WordSetSummary = {
  id: string;
  name: string;
  description?: string;
  count: number;
  source: SetSource;
  readOnly?: boolean;
  createdAt: string;
  updatedAt: string;
};

// for later word creation
export type WordInput = { word: string; definition?: string };