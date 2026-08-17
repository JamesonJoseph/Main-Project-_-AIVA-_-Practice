# AGENTS.md

Compact guidance for working in this repo. Read `README.md` for full context.

## What this project is
A Next.js 15 (App Router, TypeScript) app called **Fossil**. It is intentionally
**backend-free and database-free**: all data lives in the browser's
`localStorage` and syncs across tabs via `BroadcastChannel`. There is no server,
no Postgres/KV/Blob, and no real Vercel cron. The decay "cron" runs client-side
on a 60s heartbeat inside `lib/usePosts.ts`.

## Commands
- `npm run dev` — local dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run typecheck` — `tsc --noEmit` (the primary verification step)
- `npm run lint` — `next lint` (not configured with rules; typecheck is the main gate)

Run `npm run typecheck` after edits. There is no test suite.

## Hardcoded "envs"
All would-be env vars (`POSTGRES_URL`, `KV_URL`, `BLOB_READ_WRITE_TOKEN`,
`CRON_SECRET`, `OPENAI_API_KEY`) and decay constants are **hardcoded** in
`lib/config.ts` — do not introduce `process.env.*` reads unless wiring up a real
backend. `CRON_SECRET` is decorative; the cron logic is client-side.

## Architecture / where logic lives
- `lib/decay.ts` → `runDecay(posts)` is the **cron core**: recomputes integrity,
  transitions posts to `fossilized`/`dissolved`. Keep this pure (no I/O).
- `lib/integrity.ts` → `computeIntegrity` (server-truth formula) and `bandFor`.
- `lib/corruption.ts` → deterministic seeded word corruption (stable per post id).
- `lib/storage.ts` → localStorage get/set + the `syncChannel` BroadcastChannel.
- `lib/usePosts.ts` → client store hook; runs `runDecay` on mount + every 60s.
- `components/PostCard.tsx` → band-driven visuals + Framer Motion decay effects.

## Conventions / gotchas
- `fossil_image_url` is a **canvas-generated PNG data URL**, not a Blob URL.
- Reinforcement rate limit is one per anonymous identity per post
  (`lib/identity.ts` + `lib/storage.ts` `hasReinforced`).
- Fossilize threshold = 50 reinforcements; decay = 4/hr; reinforce bonus = +3.
- Do not add user accounts, comments, edit, or pagination — these are explicit
  non-goals (see README non-goals). Keep posts immutable until they decay.
- Client-only app: pages that read localStorage must be `"use client"`. Avoid
  SSR access to `window`/`localStorage` (guards already present in `lib/storage.ts`).

## Deploy
`vercel deploy` works as-is (no server needed). `vercel.json` cron entry is
decorative for this build.
