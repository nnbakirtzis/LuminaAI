# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository structure

This repo is a single **React + Vite web app** ("Lumina Careers" / AI Studio app) at the root. There is no mobile app. An Expo version used to live in `LuminaAI-mobile/` and was removed; it is still in git history if you need to reference it.

`AGENTS.md` (for Codex/Cursor) mirrors this file's content. When you update guidance here, update `AGENTS.md` too.

## Commands

```
npm install
npm run dev       # Vite dev server on port 3000
npm run build     # production build
npm run preview   # preview production build
```
Requires `GEMINI_API_KEY` in `.env.local` (see `vite.config.ts`, which exposes it as both `process.env.API_KEY` and `process.env.GEMINI_API_KEY`).

There is no lint or test command configured. The only automated check is a typecheck: run `npx tsc --noEmit` (the tsconfig is non-strict).

A TS path alias `@/*` → project root is defined in `tsconfig.json`.

Styling: Tailwind is loaded from the CDN via a `<script>` + inline `tailwind.config` in `index.html` (no PostCSS/Tailwind build step).

## Core architecture: the AI agent swarm

The product's core logic lives in `services/gemini.ts`, a multi-agent job search pipeline built on `@google/genai` (Gemini). Understanding this coordinator pattern is essential before touching it:

1. **`findAndRankJobs(prefs, onLog)`** is the entry point (called from `pages/Home.tsx`). It runs agents in stages, reporting progress through the `onLog(agentName, action)` callback, which the UI renders as a live agent log (`AgentTerminal`, `StatusVisualizer`, `DebugSidebar`).
2. **Stage 1 — Headhunter Agent** (`MODEL_FLASH`, `gemini-3-flash-preview`): discovers and ranks 6–8 jobs matching `UserPreferences`, optionally scoring against an attached resume. It does not use search grounding.
3. **Stage 2 — Intelligence Swarm**, only if `prefs.enableIntelligence` is true: three agents run **in parallel** via `Promise.all` against the base job list —
   - **Economist Agent** (Flash) — supply/demand + competitiveness score
   - **Compensation Futurist Agent** (`MODEL_PRO`, `gemini-3-pro-preview`) — 18-month salary forecast (kept on Pro deliberately for deeper reasoning)
   - **Career Strategist Agent** (Flash) — long-term career trajectory
   Results are merged back onto each `Job` by matching `id`. A swarm failure is caught and the coordinator degrades gracefully to base (non-enriched) job results rather than failing the whole search.
4. **`generateTailoredResume(job, resume)`** — the **Resumator Agent** (Flash) rewrites an existing resume against a specific job description. Its system instruction explicitly forbids inventing skills/experience not present in the source resume — preserve this constraint if you touch the prompt.
5. **`calculateRealValue(job, userLocation, onLog)`** — the **Financial Analyst Agent** (Pro + `googleSearch` grounding) computes a Purchasing Power Parity "Real Value" for a salary offer between two locations, returning structured JSON plus grounding `sources` extracted from `groundingMetadata`.

Each agent call is JSON-schema-constrained via `responseSchema` (`Type.OBJECT`/`Type.ARRAY`), and every call is recorded by a per-run `CostTracker` that estimates USD cost from `usageMetadata` token counts and a flat `PRICING[model]` table (older proxy rates), logging a cost summary through the same `onLog` channel. If you add a new model, register it in `PRICING` — otherwise costs silently fall back to Flash rates.

Model selection is a deliberate cost/quality split: Flash for discovery/classification-shaped tasks, Pro for tasks needing longer-range reasoning or search grounding (Futurist, Financial Analyst). Preserve this split unless there's a reason to change it.

## Auth (mock)

`services/auth.ts` and `context/AuthContext.tsx` implement a **mock** auth service using `localStorage` and `setTimeout`-simulated latency. The file header says to replace it with real (e.g. Firebase) calls before production — don't treat its "validation" (e.g. password length) as real security.

`AuthContext` exposes `user`, `isLoading`, `login`, `register`, `logout`. Routes are guarded with `ProtectedRoute` + `react-router-dom` `HashRouter`.

## Prompt-injection / input handling

`UserPreferences` fields are user-controlled and interpolated directly into agent prompts. Free-text fields (`jobTitle`, `location` in the Headhunter prompt, `userLocation` in the Financial Analyst prompt) are wrapped with `wrapUserText()` from `utils/security.ts`, which runs `sanitizeInput()` (strips HTML/brackets, caps at 500 chars) and delimits the result with `[USER_DATA_START]`/`[USER_DATA_END]`. The Headhunter and Financial Analyst system instructions tell the model to treat delimited text as data, never instructions. When you add new user-supplied text to a prompt, wrap it the same way and make sure that agent's system instruction carries the same rule.

## Logging

The app uses plain `console.error`/`onLog` only — there's no structured logger.
