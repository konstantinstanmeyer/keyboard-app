import { MUTED,  INK, ERROR } from "@/lib/words/colors";

import { memo, ReactNode } from "react";

export const Word = memo(function Word({
  target,
  typed,
  active,
}: {
  target: string;
  typed?: string;
  active: boolean;
}) {
  const tlen = typed?.length ?? 0;
  const n = Math.max(target.length, tlen);
  const spans: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const wc = target[i];
    const tc = typed?.[i];
    let color: string;
    let opacity = 1;
    if (tc == null) color = MUTED; // untyped
    else if (wc == null) {
      color = ERROR; // overtyped extra
      opacity = 0.8;
    } else if (tc === wc) color = INK; // correct
    else color = ERROR; // wrong (no underline)
    spans.push(
      <span key={i} style={{ color, opacity }}>
        {wc ?? tc}
      </span>,
    );
  }
  return (
    <span
      data-active={active ? 'true' : undefined}
      className="inline-block mr-[0.5em] whitespace-nowrap font-light"
    >
      {spans}
    </span>
  );
});