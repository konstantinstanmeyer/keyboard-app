// color palette
const INK = '#24322b';
const MUTED = '#9aa693';
const RULE = '#b7c0aa';
const ERROR = '#b5623a'; // mistyped

const DURATIONS = [15, 30, 60, 120] as const;

async function fetchWords(count:number): Promise<any[]> {
  const res = await fetch(`/api/words?count=${count}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('error')
  
  const data = (await res.json()) as { words: any[] }
  return data.words.map((e) => ({w: e.word, d: e.definition }));
}

export default function Home() {
  return (
    <main>
      hello world!
    </main>
  );
}