import { CONFIG, BAND_THRESHOLDS } from "./config";
import type { IntegrityBand, Post } from "./types";

/**
 * Recompute a post's integrity from first principles.
 * Server-truth rule (never trust the client): integrity is a function of
 * elapsed time and reinforcement count only — the cached value is just a
 * caching optimization, never the source of truth.
 */
export function computeIntegrity(
  createdAt: number,
  reinforcements: number,
  now: number = Date.now()
): number {
  const hoursElapsed = Math.max(0, (now - createdAt) / (1000 * 60 * 60));
  const decayed = CONFIG.MAX_INTEGRITY - hoursElapsed * CONFIG.DECAY_PER_HOUR;
  const restored = decayed + reinforcements * CONFIG.REINFORCE_BONUS;
  return clamp(Math.round(restored), 0, CONFIG.MAX_INTEGRITY);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function bandFor(integrity: number, status: Post["status"]): IntegrityBand {
  if (status === "fossilized") return "fossilized";
  if (integrity <= BAND_THRESHOLDS.dissolved) return "dissolved";
  if (integrity >= BAND_THRESHOLDS.fresh) return "fresh";
  if (integrity >= BAND_THRESHOLDS.fading) return "fading";
  if (integrity >= BAND_THRESHOLDS.terminal) return "critical";
  return "terminal";
}

/** Percentage of words to corrupt = (100 - integrity). */
export function corruptionPercent(integrity: number): number {
  return clamp(100 - integrity, 0, 100);
}
