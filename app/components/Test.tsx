"use client"
import { useEffect, useState, useMemo, useRef, useCallback, useLayoutEffect } from "react";
import { Word } from "./Word";
import { Result, State } from "@/lib/words/types";
import { MUTED,  INK, ERROR, ACCENT } from "@/lib/words/colors";

type Entry = { w: string; d: string };

const DURATIONS = [15, 30, 60, 120] as const;
const LINE = 48;
const VISIBLE = 3; // lines per "window"

// settings for caret in I-beam state.. possibly change to diff. later
const CARET_H = 28;
const CARET_TOP = -3;
const CAP_W = 6; // width of the I-beam serifs
const CAP_HALF = CAP_W / 2;

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

function grade(s: State) {
  let correct = 0,
    incorrect = 0,
    extra = 0;
  const { words, history, input, wordIndex } = s;
  for (let i = 0; i < wordIndex; i++) {
    const t = history[i] ?? '';
    const w = words[i] ?? '';
    const n = Math.max(t.length, w.length);
    for (let j = 0; j < n; j++) {
      const tc = t[j];
      const wc = w[j];
      if (tc == null) incorrect++;
      else if (wc == null) extra++;
      else if (tc === wc) correct++;
      else incorrect++;
    }
    correct++; // the trailing space, once committed
  }
  const w = words[wordIndex] ?? '';
  for (let j = 0; j < input.length; j++) {
    const tc = input[j];
    const wc = w[j];
    if (wc == null) extra++;
    else if (tc === wc) correct++;
    else incorrect++;
  }
  return { correct, incorrect, extra };
}

export default function Page() {
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
  const [focused, setFocused] = useState(true);

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
  const caretRef = useRef<HTMLImageElement>(null);

  const caretIndexRef = useRef(0);
  caretIndexRef.current = input.length;

  const pokeCaret = useCallback(() => {
    const c = caretRef.current;
    if (!c) return;
    c.style.animation = 'none';
    c.style.opacity = '1';
    if (blinkTimer.current) window.clearTimeout(blinkTimer.current);
    blinkTimer.current = window.setTimeout(() => {
      const cc = caretRef.current;
      if (!cc) return;
      cc.style.animation = '';
      cc.style.opacity = '';
    }, 600);
  }, []);

  const place = useCallback(() => {
    const inner = innerRef.current;
    const caret = caretRef.current;
    if (!inner || !caret) return;
    const active = inner.querySelector('[data-active="true"]') as HTMLElement | null;
    if (!active) return;

    const off = Math.max(0, active.offsetTop - LINE);
    inner.style.transform = `translateY(${-off}px)`;

    const letters = active.children;
    const idx = caretIndexRef.current;
    let x: number, y: number;
    if (idx < letters.length) {
      const el = letters[idx] as HTMLElement;
      x = el.offsetLeft;
      y = el.offsetTop;
    } else if (letters.length > 0) {
      const el = letters[letters.length - 1] as HTMLElement;
      x = el.offsetLeft + el.offsetWidth;
      y = el.offsetTop;
    } else {
      x = active.offsetLeft;
      y = active.offsetTop;
    }
    caret.style.transform = `translate(${x - CAP_HALF}px, ${y + CARET_TOP}px)`;
    pokeCaret();
  }, [pokeCaret]);

  const newTest = useCallback(
    async (dur = durationRef.current) => {
      durationRef.current = dur;
      setDuration(dur);
      setWordIndex(0);
      setInput('');
      setHistory([]);
      setStatus('idle');
      setRemaining(dur);
      setLiveWpm(0);
      setResult(null);
      setError(false);
      setLoading(true);
      typedRef.current = 0;
      errorRef.current = 0;
      startRef.current = 0;
      if (innerRef.current) innerRef.current.style.transform = 'translateY(0px)';
      try {
        const fresh = await fetchWords(80);
        setItems(fresh);
        requestAnimationFrame(() => {
          inputRef.current?.focus();
          place();
        });
      } catch {
        setItems([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [place],
  );

  useEffect(() => {
    newTest(30);
  }, []);

  useEffect(
    () => () => {
      if (blinkTimer.current) window.clearTimeout(blinkTimer.current);
    },
    [],
  );

  useEffect(() => {
    const c = caretRef.current;
    if (c) c.dataset.hidden = !focused || loading ? 'true' : 'false';
  }, [focused, loading]);

  useEffect(() => {
    if (status !== 'running') return;
    const id = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      const rem = Math.max(0, durationRef.current - elapsed);
      setRemaining(rem);
      const g = grade(stateRef.current);
      setLiveWpm(elapsed > 0 ? (g.correct / 5) / (elapsed / 60) : 0);
      if (rem <= 0) {
        clearInterval(id);
        const typed = typedRef.current;
        const errors = errorRef.current;
        setResult({
          wpm: (g.correct / 5) / (elapsed / 60),
          raw: ((g.correct + g.incorrect + g.extra) / 5) / (elapsed / 60),
          acc: typed ? ((typed - errors) / typed) * 100 : 100,
          correct: g.correct,
          incorrect: g.incorrect + g.extra,
          time: Math.round(durationRef.current),
          typed,
        });
        setStatus('finished');
      }
    }, 100);
    return () => clearInterval(id);
  }, [status]);

  const start = useCallback(() => {
    startRef.current = Date.now();
    setStatus('running');
    setRemaining(durationRef.current);
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const k = e.key;
      if (k === 'Tab') {
        e.preventDefault();
        void newTest();
        return;
      }
      if (status === 'finished') return;
      if (items.length === 0) return;

      if (e.ctrlKey || e.metaKey || e.altKey) {
        if (k === 'Backspace') {
          e.preventDefault();
          setInput('');
        }
        return;
      }
      if (k === 'Backspace') {
        e.preventDefault();
        if (input.length > 0) setInput(input.slice(0, -1));
        else if (wordIndex > 0) {
          const prev = history[wordIndex - 1] ?? '';
          if (prev !== (words[wordIndex - 1] ?? '')) {
            setHistory((h) => h.slice(0, -1));
            setWordIndex((i) => i - 1);
            setInput(prev);
          }
        }
        return;
      }
      if (k === ' ') {
        e.preventDefault();
        if (input.length === 0) return;
        if (status === 'idle') start();
        setHistory((h) => [...h, input]);
        setWordIndex((i) => i + 1);
        setInput('');
        if (wordIndex + 1 > items.length - 24 && !fetchingMoreRef.current) {
          fetchingMoreRef.current = true;
          fetchWords(60)
            .then((more) => setItems((p) => [...p, ...more]))
            .catch(() => {})
            .finally(() => {
              fetchingMoreRef.current = false;
            });
        }
        return;
      }
      if (k.length === 1) {
        e.preventDefault();
        if (status === 'idle') start();
        const w = words[wordIndex] ?? '';
        if (input.length >= w.length + 8) return;
        typedRef.current++;
        const expected = w[input.length];
        if (expected == null || k !== expected) errorRef.current++;
        setInput(input + k);
      }
    },
    [status, input, wordIndex, history, words, items.length, start, newTest],
  );

  const rendered = useMemo(
    () =>
      items.map((it, i) => (
        <Word
          key={i}
          target={it.w}
          typed={i < wordIndex ? history[i] : i === wordIndex ? input : undefined}
          active={i === wordIndex}
        />
      )),
    [items, wordIndex, input, history],
  );

  useLayoutEffect(() => {
    place();
  }, [rendered, status, focused, loading, place]);

  useEffect(() => {
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [place]);

  const cur = items[wordIndex];
  const secs = Math.ceil(remaining);

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center"
      style={{
        color: INK,
        backgroundImage:
          'radial-gradient(120% 80% at 50% -10%, #edf0e6 0%, #e4e8dd 45%, #dbe0d2 100%)',
      }}
    >
      <style>{`
        @keyframes rar-blink { 0%{opacity:1} 50%{opacity:0} 100%{opacity:1} }
        @keyframes rar-rise { from{opacity:0; transform:translateY(6px)} to{opacity:1; transform:none} }
        .rar-caret{
          animation: rar-blink 1.05s ease-in-out infinite;
        }
        .rar-caret::before, .rar-caret::after{
          content:''; position:absolute; right:0;;
        }
        .rar-caret::before{ top:0 }
        .rar-caret::after{ bottom:0 }
        .rar-caret[data-hidden="true"]{ display:none }
        .rar-rise{ animation: rar-rise .5s cubic-bezier(.2,.7,.2,1) both; }
        ::selection{ background: rgba(47,111,99,.18); }
        @media (prefers-reduced-motion: reduce){
          .rar-caret{ animation:none }
          .rar-rise{ animation:none }
          *{ transition:none !important }
        }
      `}</style>
      <header className="pt-14 pb-8 text-center">
        <div className="text-[11px] tracking-[0.42em] uppercase" style={{ color: ACCENT }}>
          a typing copybook of
        </div>
        <h1
          className="mt-2 text-[40px] leading-none tracking-[0.16em] uppercase"
          style={{ fontWeight: 500 }}
        >
          LINOTYPE
        </h1>
        <div className="mt-3 flex items-center justify-center gap-3 muted">
          <span className="h-px w-10" />
          <span className="text-[13px] italic">
            forgotten words, one keystroke at a time
          </span>
          <span className="h-px w-10" />
        </div>
      </header>
      <nav className="mb-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px]">
        <div className="flex items-center gap-1">
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => void newTest(d)}
              className="px-2.5 py-1 tracking-wide transition-colors border-b"
              style={{
                color: duration === d ? ACCENT : '#7c8a78',
                borderColor: duration === d ? ACCENT : 'transparent',
              }}
            >
              {d}s
            </button>
          ))}
        </div>
        <span className="hidden sm:block h-4 w-px" />
        <button
          onClick={() => setShowDefs((s) => !s)}
          className={`${showDefs ? "ink" : "muted"} tracking-wide transition-colors`}
        >
          {showDefs ? 'glosses shown' : 'glosses hidden'}
        </button>
        <span className="hidden sm:block h-4 w-px" />
        <button
          onClick={() => void newTest()}
          className="tracking-wide transition-colors text-[#7c8a78]"
        >
          ↻ begin anew
        </button>
      </nav>

      <section className="w-full max-w-3xl px-6">
        {status === 'finished' && result ? (
          <ResultCard result={result} onAgain={() => void newTest()} />
        ) : error ? (
          <div className="rar-rise py-10 text-center">
            <p className="text-[15px]" style={{ color: '#5f6d5b' }}>
              The words did not arrive. Check that the app is running, then try again.
            </p>
            <button
              onClick={() => void newTest()}
              className="mt-6 px-5 py-2 text-[12px] uppercase tracking-[0.3em] border transition-colors"
              style={{ color: ACCENT, borderColor: 'rgba(47,111,99,.4)' }}
            >
              retry
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-end justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-[34px] leading-none" style={{ color: ACCENT }}>
                  {status === 'running' ? secs : duration}
                </span>
                <span className="text-[11px] uppercase tracking-[0.3em] muted">
                  {status === 'running' ? 'seconds left' : 'second trial'}
                </span>
              </div>
              <div className="text-right">
                {status === 'running' ? (
                  <span className="text-[13px]" style={{ color: '#5f6d5b' }}>
                    {Math.round(liveWpm)} wpm
                  </span>
                ) : (
                  <span className="text-[13px] italic muted">
                    {loading ? 'gathering words' : 'type to start the clock'}
                  </span>
                )}
              </div>
            </div>
            {showDefs && (
              <div className="mb-3 h-6 truncate">
                {cur && (
                  <>
                    <span className="text-[13px] uppercase tracking-[0.28em]" style={{ color: ACCENT }}>
                      {cur.w}
                    </span>
                    <span className="mx-2">
                      —
                    </span>
                    <span className="text-[15px] italic" style={{ color: '#5f6d5b' }}>
                      {cur.d}
                    </span>
                  </>
                )}
              </div>
            )}
            <div className="relative cursor-text" onClick={() => inputRef.current?.focus()}>
              <div className="relative overflow-y-hidden pl-5!" style={{ height: LINE * VISIBLE }}>
                <div
                  ref={innerRef}
                  className="absolute left-0 right-0 top-0 will-change-transform"
                  style={{
                    transform: 'translateY(0px)',
                    transition: 'transform .18s cubic-bezier(.2,.7,.2,1)',
                    marginLeft: 20,
                    fontSize: 27,
                    lineHeight: `${LINE}px`,
                  }}
                >
                  <div
                    ref={caretRef}
                    data-hidden="true"
                    className={` caret-transform w-6 h-7 rar-caret absolute left-0 top-0 will-change-transform transition-all duration-40`}
                    style={{
                      transform: `translate(-20px,${CARET_TOP}px)`,
                    }}
                  >
                    <img className="absolute h-full scale-y-125" src="/caret.svg" alt="" />
                  </div>
                  {rendered}
                </div>
              </div>
              {loading ? (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-[rgba(228,232,221,.55)]"
                >
                  <span className="text-[12px] uppercase tracking-[0.3em]" style={{ color: '#5f6d5b' }}>
                    gathering rare words
                  </span>
                </div>
              ) : (
                !focused && (
                  <button
                    onClick={() => inputRef.current?.focus()}
                    className="absolute inset-0 flex items-center justify-center backdrop-blur-[3px] bg-[rgba(228,232,221,.4)]"
                  >
                    <span className="text-[13px] uppercase tracking-[0.3em] text-[#5f6d5b]">
                      click to resume
                    </span>
                  </button>
                )
              )}
            </div>
          </>
        )}
        <input
          ref={inputRef}
          onKeyDown={onKeyDown}
          onChange={(e) => {
            e.currentTarget.value = '';
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="fixed top-0 left-0 h-px w-px opacity-0"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          aria-label="typing field"
          tabIndex={-1}
        />
      </section>
      <footer className="mt-auto py-8 text-[11px] tracking-[0.25em] uppercase text-[#a2ad9d]">
        tab — restart
      </footer>
    </main>
  );
}

function ResultCard({ result, onAgain }: { result: Result; onAgain: () => void }) {
  const stat = (label: string, value: string) => (
    <div className="text-center">
      <div className="text-[22px] ink">
        {value}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.28em] muted">
        {label}
      </div>
    </div>
  );

  return (
    <div className="rar-rise text-center">
      <div className="text-[11px] uppercase tracking-[0.4em] accent" >
        specimen record
      </div>
      <div className="mt-3 leading-none ink text-[96px]">
        {Math.round(result.wpm)}
      </div>
      <div className="mt-1 text-[12px] uppercase tracking-[0.3em] text-[#5f6d5b]">
        words per minute
      </div>

      <div className="mx-auto my-7 flex items-center justify-center gap-3">
        <span className="h-px w-16" />
        <span className="accent">&#10087;</span>
        <span className="h-px w-16" />
      </div>

      <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-4">
        {stat('accuracy', `${Math.round(result.acc)}%`)}
        {stat('raw', String(Math.round(result.raw)))}
        {stat('keystrokes', String(result.typed))}
        {stat('trial', `${result.time}s`)}
      </div>

      <button
        onClick={onAgain}
        className="border-[rgba(47,111,99,.4)] accent mt-9 px-5 py-2 text-[12px] uppercase tracking-[0.3em] border transition-colors"
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = ACCENT;
          e.currentTarget.style.color = '#f0f2ea';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = ACCENT;
        }}
      >
        begin anew
      </button>
    </div>
  );
} 