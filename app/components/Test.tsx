"use client"
import { useEffect, useState, useMemo, useRef } from "react";
import { Word } from "./Word";
import { Result, State } from "@/lib/words/types";

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
  // const [words, setWords] = useState<Entry[]>([])
  const [duration, setDuration] = useState<number>(30);
  const [showDefs, setShowDefs] = useState(true);
  const [items, setItems] = useState<Entry[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'finished'>('idle');
  const [remaining, setRemaining] = useState(30);
  const [liveWpm, setLiveWpm] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mode, setMode] = useState<"testing" | "sandbox">("testing");

  const words = useMemo(() => items.map((i) => i.w), [items]);

  const stateRef = useRef<State>({ words, history, input, wordIndex});
  stateRef.current = { words, history, input, wordIndex };

  const durationRef = useRef(duration);
  durationRef.current = duration;

  const startRef = useRef(0);
  const typedRef = useRef(0);
  const errorRef = useRef(0);
  const fetchingMoreRef = useRef(false);
  const blinkTimer = useRef<number | undefined>(undefined);

  const inputRef = useRef<HTMLInputElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   (async() => {
  //     const temp = await fetchWords(10);
  //     if(temp){
  //       setWords(temp)
  //     }
  //   })();
  // }, [])

  // const rendered = useMemo(
  //   () =>
  //     words.map((it, i) => (
  //       <Word
  //         key={i}
  //         target={it.w}
  //       />
  //     )),
  //   [words],
  // );

  return (
    <div>
      {/* {rendered} */}
    </div>
  )
} 