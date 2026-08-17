"use client";

import { useEffect, useState } from "react";

const FRAMES = [
  `  .  .
 .   .
.     .
 .   .
  .  .`,
  `   ^
  / \\
 /   \\
 \\   /
  \\ /
   v`,
  `  .+.
 .· ·.
.· F ·.
 .· ·.
  .+.`,
  `   /\\
  /  \\
 /    \\
 \\    /
  \\  /
   \\/`,
];

const MESSAGES = [
  "excavating the feed…",
  "decaying…",
  "fossilizing…",
  "digging…",
];

export default function AsciiLoader() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-fossil-fading">
      <pre
        aria-hidden
        className="animate-flicker font-mono leading-tight text-fossil-accent"
        style={{ fontSize: "1rem" }}
      >
        {FRAMES[frame]}
      </pre>
      <p className="animate-pulseCta font-mono text-sm tracking-widest">
        {MESSAGES[frame]}
      </p>
    </div>
  );
}