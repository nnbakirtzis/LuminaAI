# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository structure

This repo contains **two independent, separately-deployed applications** that share the same product concept but **no shared code or build tooling**:

- **Root (`/`)** — a React + Vite web app ("Lumina Careers" / AI Studio app).
- **`LuminaAI-mobile/`** — an Expo (React Native) app ("Lumina.AI") with its own `package.json`, `tsconfig.json`, and git-ignored rules.

The two apps duplicate concepts (`types.ts`, `services/gemini.ts`, `services/auth.ts`, several components) with platform-specific implementations. When changing shared logic (e.g. an agent prompt or a `Job`/`UserPreferences` field), check whether the equivalent file in the other app needs the same change — there is no automated sync.

Always `cd` into the correct app directory (or target it explicitly) before running commands — the two `package.json` files are independent.

## Commands

### Web app (root)
```
npm install
npm run dev       # Vite dev server on port 3000
npm run build     # production build
npm run preview   # preview production build
```
Requires `GEMINI_API_KEY` in `.env.local` (see `vite.config.ts`, which exposes it as both `process.env.API_KEY` and `process.env.GEMINI_API_KEY`).

There is no lint or test command configured in this package.

### Mobile app (`LuminaAI-mobile/`)
```
cd LuminaAI-mobile
npm install
npm start          # expo start
npm run android
npm run ios
npm run web         # expo start --web
```
Requires a `.env` file with `EXPO_PUBLIC_GEMINI_API_KEY`, `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

There is no lint or test command configured in this package either.

Both apps define a TS path alias `@/*` → project root (see each `tsconfig.json`).

## Core architecture: the AI agent swarm

The product's core logic lives in `services/gemini.ts` (web) and `LuminaAI-mobile/services/gemini.ts` (mobile) — nearly-parallel implementations of a multi-agent job search pipeline built on `@google/genai` (Gemini). Understanding this coordinator pattern is essential before touching either file:

1. **`findAndRankJobs(prefs, onLog)`** is the entry point (called from `pages/Home.tsx` / `app/(tabs)/index.tsx`). It runs agents in stages, reporting progress through the `onLog(agentName, action)` callback, which the UI renders as a live agent log (`AgentTerminal`, `StatusVisualizer`, `DebugSidebar` on web).
2. **Stage 1 — Headhunter Agent** (`MODEL_FLASH`, `gemini-3-flash-preview`): discovers and ranks 6–8 jobs matching `UserPreferences`, optionally scoring against an attached resume. The mobile version enables `googleSearch` grounding and requires real, verifiable posting URLs; the web version does not use search grounding.
3. **Stage 2 — Intelligence Swarm**, only if `prefs.enableIntelligence` is true: three agents run **in parallel** via `Promise.all` against the base job list —
   - **Economist Agent** (Flash) — supply/demand + competitiveness score
   - **Compensation Futurist Agent** (`MODEL_PRO`, `gemini-3-pro-preview`) — 18-month salary forecast (kept on Pro deliberately for deeper reasoning)
   - **Career Strategist Agent** (Flash) — long-term career trajectory
   Results are merged back onto each `Job` by matching `id`. A swarm failure is caught and the coordinator degrades gracefully to base (non-enriched) job results rather than failing the whole search.
4. **`generateTailoredResume(job, resume)`** — the **Resumator Agent** (Flash) rewrites an existing resume against a specific job description. Its system instruction explicitly forbids inventing skills/experience not present in the source resume — preserve this constraint if you touch the prompt.
5. **`calculateRealValue(job, userLocation, onLog)`** — the **Financial Analyst Agent** (Pro + `googleSearch` grounding) computes a Purchasing Power Parity "Real Value" for a salary offer between two locations, returning structured JSON plus grounding `sources` extracted from `groundingMetadata`.

Each agent call is JSON-schema-constrained via `responseSchema` (`Type.OBJECT`/`Type.ARRAY`), and every call is recorded by a per-run `CostTracker` that estimates USD cost from `usageMetadata` token counts and per-model pricing tables, logging a cost summary through the same `onLog` channel. If you add a new agent or model, register it in `PRICING` or costs will silently fall back to Flash rates.

Model selection is a deliberate cost/quality split: Flash for discovery/classification-shaped tasks, Pro for tasks needing longer-range reasoning or search grounding (Futurist, Financial Analyst). Preserve this split unless there's a reason to change it.

## Auth: web (mock) vs. mobile (Supabase)

- **Web** (`services/auth.ts`, `context/AuthContext.tsx`): a **mock** auth service using `localStorage` and `setTimeout`-simulated latency. The file header says to replace it with real (e.g. Firebase) calls before production — don't treat its "validation" (e.g. password length) as real security.
- **Mobile** (`LuminaAI-mobile/services/auth.ts`, `services/supabase.ts`): real Supabase auth (`signInWithPassword`, `signUp`, `signOut`, `getSession`), backed by a custom storage adapter that uses `expo-secure-store` on native and `localStorage` on web. The Supabase schema and RLS policies are documented in `LuminaAI-mobile/architecture.md` (tables `profiles`, `saved_jobs`, `resumes` storage bucket).

Both apps expose the same `AuthContext` shape (`user`, `isLoading`, `login`, `register`, `logout`) so route-guarding logic looks similar: web uses `ProtectedRoute` + `react-router-dom` `HashRouter`; mobile redirects between `(tabs)` and `/login` inside `app/_layout.tsx` based on `useAuth()` + `expo-router` segments.

## Prompt-injection / input handling

Since `UserPreferences` fields (job title, location, etc.) are user-controlled and interpolated directly into agent prompts, mobile wraps them with `wrapUserText()` / `sanitizeInput()` from `LuminaAI-mobile/utils/security.ts` (strips HTML/brackets, caps length, delimits with `[USER_DATA_START]`/`[USER_DATA_END]`) before sending to Gemini. The web app's `services/gemini.ts` does not yet apply this wrapping — keep this in mind if porting agent changes between the two, and prefer sanitizing new user-supplied prompt input on both sides.

## Resume handling (mobile)

Mobile resumes are not always held in memory as base64 — `LuminaAI-mobile/utils/resumeManager.ts` (`ResumeManager`) caches resumes to local file storage keyed by Supabase storage path, falling back to downloading from the `resumes` Supabase bucket on cache miss. Agent code that needs resume bytes (`generateTailoredResume`, the Headhunter agent) checks for an inline `base64` first and falls back to `resume.storagePath` + `ResumeManager.getResumeBase64()`.

## Logging

Mobile has a `__DEV__`-gated logger (`LuminaAI-mobile/utils/logger.ts`, prefix `[LuminaAI]`) used throughout `services/*` for structured start/success/error events. The web app uses plain `console.error`/`onLog` only — there's no equivalent structured logger.
