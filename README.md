# Fossil

An anonymous message board where posts **decay over time** unless the community
reinforces them. Popular posts fossilize into permanent artifacts; ignored posts
dissolve and are gone forever. No login — identity is a lightweight anonymous
UUID stored in the browser.

> **Adaptation note:** The original spec called for Vercel Postgres, KV, Blob, an
> AI provider, and server cron jobs. This build runs **entirely peer-to-peer with
> no backend or database** — every "env var" is **hardcoded** in `lib/config.ts`
> and all data lives in the user's `localStorage`. The decay logic runs
> **client-side** on a heartbeat (see `lib/usePosts.ts` + `lib/decay.ts`) — no
> Vercel cron jobs, so it works on the **free (Hobby) plan**.
>
> **Vercel free-plan note:** No `vercel.json` cron jobs are used — Vercel's Hobby
> plan limits cron jobs to once per day and rejects hourly schedules at deploy
> time. Decay is evaluated in the browser instead, so this deploys cleanly on the
> free plan. All other features used (Next.js static hosting, browser
> `localStorage`, `BroadcastChannel`) are free-plan compatible.

## How it works

- **Integrity (0–100)** is computed server-truth-style from `created_at` and
  `reinforcements` only: `-4/hour` decay, `+3` per reinforcement, capped at 100.
- **Bands** drive visuals: Fresh (70–100) → Fading (35–69) → Critical (10–34) →
  Terminal (1–9) → Dissolved (0). Fossilized posts are frozen at 100.
- **Reinforcements** are rate-limited per anonymous identity (one per post).
- **Fossilize** at 50+ reinforcements: integrity freezes at 100, a static image
  is rendered to a canvas data URL, and the post enters `/fossils`.
- **Dissolve** at integrity 0: a deterministic "epitaph" is generated and the
  post leaves the live feed forever.

## Getting started

```bash
npm install
npm run dev
# open http://localhost:3000
```

No environment variables are required — they are hardcoded in `lib/config.ts`.

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run typecheck` — `tsc --noEmit`

## Project layout

```
app/
  layout.tsx          root layout + nav
  page.tsx            live feed (/)
  post/page.tsx       composer (/post)
  fossils/page.tsx    fossil gallery (/fossils)
components/
  PostCard.tsx        corruption + Framer Motion decay visuals
  Composer.tsx        textarea composer
  ReinforceButton.tsx optimistic reinforce button
lib/
  config.ts           HARDCODED envs + decay constants
  types.ts            Post / ReinforcementRecord
  integrity.ts        computeIntegrity, bandFor, corruptionPercent
  corruption.ts       deterministic seeded word corruption
  decay.ts            runDecay() — the cron core + feed selectors
  storage.ts          localStorage store + BroadcastChannel sync
  identity.ts         anonymous UUID (cookie analog)
  fossilImage.ts      canvas -> PNG data URL
  epitaphs.ts         local deterministic epitaph generator
  usePosts.ts         client store + 2-day decay heartbeat
```

## Peer-to-peer sharing

Each browser keeps its own copy of the feed in `localStorage`. Posts sync
**across tabs/windows** of the same browser via `BroadcastChannel`
(`lib/storage.ts`). To share your feed with another device/person, export the
`fossil.posts.v1` and `fossil.reinforcements.v1` localStorage keys and import
them on the other side.

## Deploying to Vercel

This build needs no server, so `vercel deploy` works as-is. If you later want
real multi-user persistence, swap the hardcoded values in `lib/config.ts` for
`process.env.*` and replace `lib/storage.ts` with `@vercel/postgres` +
`@vercel/kv` + `@vercel/blob`, keeping `lib/decay.ts` (the cron core) unchanged.
