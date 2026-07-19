import { lexicon } from './lexicon';
import type { WordEntry } from './types';

export function sampleWords(count: number, source: WordEntry[] = lexicon): WordEntry[] {
    const out: WordEntry[] = [];
    if (source.length === 0) return out;

    let last = -1;
    for (let i = 0; i < count; i++) {
        let k = Math.floor(Math.random() * source.length);
        if (source.length > 1) {
            while (k === last) k = Math.floor(Math.random() * source.length);
        }
        last = k;
        out.push(source[k]);
    }
    return out;
}