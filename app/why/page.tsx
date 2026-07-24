import Link from 'next/link';

const intro = [
  `I've always been fascinated by processes of learning, however, wherever, whenever.`,
  `This project functions to test several things, unofficially, while also trying to track user growth to confirm my hypothesis.`,
  `When you learn how to approach something in a new lens, the reinforcement, and exposure to the newly learned "thing" is in my mind the most important factor.`,
  `Understanding things in a more abstract sense allows us to re-approach the initial problem with a that lens.`,
  `In this test and case, users are extremely good—more specifically expert typers but all-encompassing—at shutting their brain off when typing words we already know.`,
  `We don't make the mind-finger connection to consciously think of where to move our fingers unless we have to actively think of that word to correctly process it, or to process character comes next in a complex sequence.`,
  `i.e. When you see cleft vs yclept (even just thinking of it as clept vs yclept, I just don't want to see if clept is a real word. And yes... I know the words do not mean the same thing stop adding so many layers). If I was to, myself, try and type those instantly after seeing them I'd certainly struggle on the latter, even if the difference is a tenth of a second.`,
  `This is a test to bridge that gap. To see if removing the regularity of the words, and character sequences, can reformat how we subconsciously handle recalls.`,
  `It's truly pointless, but I'd love to know the answer all the more.`,
];

const outro = [
  `And y'know what's even better?`,
  `You get to learn words at the exact same time! Have a book in mind you're planning to read but the long vocab list your recommender spoke of is daunting second to none?`,
  `Import it! Abstract your word-to-typing ratio and prepare at the same time.`,
];

export default function WhyPage() {
  return (
    <main
      className="mx-auto w-full max-w-2xl px-6 pb-28 pt-6 ink font-sans"
    >
      <header className="mb-10">
        <div className="text-[11px] uppercase tracking-[0.4em] accent">
          why
        </div>
        <h1 className="mt-2 text-[34px] leading-tight font-serif">
          A pointless experiment
        </h1>
      </header>

      <article className="font-serif">
        {intro.map((text, i) => (
          <p
            key={i}
            className={` ${i === 0 ? "text-[20px]" : "mt-5 text-[17px]"}`}
          >
            {text}
          </p>
        ))}

        {/* the turn */}
        <div className="my-12 flex items-center justify-center gap-5" aria-hidden>
          <span className="h-px w-16"/>
          <span className="text-lg muted">
            ❧
          </span>
          <span className="h-px w-16 bg-rule" />
        </div>

        {outro.map((text, i) => (
          <p
            key={i}
            className={i === 0 ? 'text-[20px] italic' : 'mt-5 text-[17px]'}
          >
            {text}
          </p>
        ))}
      </article>

      <Link
        href="/upload"
        className="mt-10 inline-block text-[12px] uppercase tracking-[0.28em] transition-colors"

      >
        → bring your own words
      </Link>

      <p className="mt-3 text-[12px]" >
        or just start the{' '}
        <Link href="/" className="underline underline-offset-2">
          trial
        </Link>
        .
      </p>
    </main>
  );
}