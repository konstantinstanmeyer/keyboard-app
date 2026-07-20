"use client"
import { useEffect, useState, useMemo } from "react";
import { Word } from "./Word";

type Entry = { w: string; d: string };

const DURATIONS = [15, 30, 60, 120] as const;

async function fetchWords(count:number): Promise<Entry[]> {
  const res = await fetch(`/api/words?count=${count}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('error')
  
  const data = (await res.json()) as { words: any[] }
  
  return data.words.map((e) => (
    {
      w: e.word, d: e.definition 
    }
  ));
}

export default function Words() {
  const [words, setWords] = useState<string[]>([])
  useEffect(() => {
    (async() => {
      const temp = await fetchWords(10);
      if(temp){
        setWords(temp)
      }
    })();
  }, [])

  const rendered = useMemo(
    () =>
      words.map((it, i) => (
        <Word
          key={i}
          target={it.w}
        />
      )),
    [words],
  );

  words.map((word, i) => console.log(word))

  return (
    <div>
      {rendered}
    </div>
  )
} 