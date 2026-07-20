import { MUTED,  INK, ERROR } from "@/lib/words/colors";

import { ReactNode, memo } from "react";

export const Word = memo(function Word({
  target,
}: {
  target: string;
}) {
  return (
    <span
      className=""
    >
      {target}
    </span>
  );
});