/**
 * Local, deterministic "AI" epitaph generator.
 * Stands in for the optional Vercel AI SDK call. Given a dissolved post, it
 * produces a short, moody one-liner. Pure + deterministic so results are
 * stable across renders.
 */

const OPENERS = [
  "Here lies a thought that no one held.",
  "Unsaid, then unremembered.",
  "The feed forgot this before you did.",
  "A signal with no one listening.",
  "It dissolved exactly as predicted.",
  "Nobody reinforced the obvious.",
  "Entropy won this round.",
];

const CLOSERS = [
  "Gone, but the silence is its own.",
  "Dissolved into the static.",
  "Another fossil that never was.",
  "Lost to the decay.",
  "The void returns what it lent.",
  "Forgotten on schedule.",
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export function generateEpitaph(content: string, id: string): string {
  // Seed from a hash of the id so the same post always gets the same epitaph.
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const opener = pick(OPENERS, h);
  const closer = pick(CLOSERS, h >> 3);
  const snippet = content.trim().slice(0, 40);
  const quoted = snippet ? ` “${snippet}${snippet.length >= 40 ? "…" : ""}”` : "";
  return `${opener}${quoted} ${closer}`;
}
