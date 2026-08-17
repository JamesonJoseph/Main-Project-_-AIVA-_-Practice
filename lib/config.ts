/**
 * HARDCODED ENVIRONMENT CONFIG
 * ----------------------------
 * The original Fossil spec expected server-side services (Vercel Postgres,
 * Vercel KV, Vercel Blob, an AI provider, and CRON_SECRET). Because this build
 * runs entirely peer-to-peer with no backend or database, every "env var" is
 * hardcoded here as a plain constant. Swap these for `process.env.*` later if
 * you ever wire up a real server.
 */

export const CONFIG = {
  // --- would-be env vars (hardcoded) ---
  POSTGRES_URL: "local://localStorage", // no DB — data lives in the user's browser
  KV_URL: "local://localStorage", // reinforcement counters + rate limits are local
  BLOB_READ_WRITE_TOKEN: "local://canvas", // fossils are rendered to a local canvas data URL
  CRON_SECRET: "fossil-dev-secret-do-not-ship", // used only by the (client) decay runner guard
  OPENAI_API_KEY: "local://deterministic", // epitaphs are generated locally, not via API

  // --- decay / mechanic constants (the heart of the app) ---
  DECAY_PER_HOUR: 4, // integrity lost per hour
  REINFORCE_BONUS: 3, // integrity restored per reinforcement (capped at 100)
  MAX_INTEGRITY: 100,
  FOSSILIZE_THRESHOLD: 50, // reinforcements needed to fossilize
  MIN_CHAR_LIMIT: 1,
  MAX_CHAR_LIMIT: 500,

  // The decay "cron" heartbeat. Runs once every two days to recompute
  // integrity and transition posts to fossilized/dissolved and persist them.
  // Live display integrity is still computed in real time (see app/page.tsx),
  // so posts keep visibly decaying between cron runs.
  CRON_INTERVAL_MS: 2 * 24 * 60 * 60 * 1000,

  // storage keys (localStorage)
  STORAGE_KEY: "fossil.posts.v1",
  REINFORCEMENTS_KEY: "fossil.reinforcements.v1",
  IDENTITY_KEY: "fossil.identity.v1",
} as const;

/** Bands are derived purely from integrity — see lib/integrity.ts. */
export const BAND_THRESHOLDS = {
  fresh: 70, // 70-100
  fading: 35, // 35-69
  critical: 10, // 10-34
  terminal: 1, // 1-9
  dissolved: 0, // 0
} as const;
