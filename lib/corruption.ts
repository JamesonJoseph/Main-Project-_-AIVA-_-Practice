/**
 * Deterministic, stable corruption.
 * We replace a percentage of words with "···" using a seeded PRNG so the same
 * post always corrupts the same words (no re-shuffling on every re-render).
 */

// Mulberry32 — tiny, fast, deterministic PRNG.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Corrupt `content` so that roughly `percent`% of its words become "···".
 * Stable per `seed` (we use the post id). Punctuation/whitespace preserved.
 */
export function corruptText(
  content: string,
  percent: number,
  seed: string
): string {
  if (percent <= 0) return content;
  if (percent >= 100) {
    return content
      .split(/(\s+)/)
      .map((tok) => (/^\s+$/.test(tok) || tok === "" ? tok : "···"))
      .join("");
  }

  const rand = mulberry32(hashString(seed));
  const tokens = content.split(/(\s+)/); // keep whitespace tokens
  const wordIdx: number[] = [];
  tokens.forEach((tok, i) => {
    if (tok && !/^\s+$/.test(tok)) wordIdx.push(i);
  });

  const target = Math.floor((percent / 100) * wordIdx.length);
  const chosen = new Set<number>();
  let guard = 0;
  while (chosen.size < target && guard < wordIdx.length * 4) {
    const pick = wordIdx[Math.floor(rand() * wordIdx.length)];
    chosen.add(pick);
    guard++;
  }

  return tokens
    .map((tok, i) => (chosen.has(i) ? "···" : tok))
    .join("");
}
