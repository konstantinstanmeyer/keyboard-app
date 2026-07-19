import type { WordEntry } from './types'
import { natureAndTime } from './collections/nature-and-time';
import { mindAndMood } from './collections/mind-and-mood';
import { wordsAndSpeech } from './collections/words-and-speech';
import { folkAndOddities } from './collections/folk-and-oddities';

export const collections = {
    natureAndTime,
    mindAndMood,
    wordsAndSpeech,
    folkAndOddities,
} as const;

export type CollectionName = keyof typeof collections;

export const lexicon: WordEntry[] = [
    ...natureAndTime,
    ...mindAndMood,
    ...wordsAndSpeech,
    ...folkAndOddities,
]