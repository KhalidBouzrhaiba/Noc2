# NOCTAVIAE

A Halloween mystery investigation game set in the fictional town of **Hollowmere**. Explore illustrated
locations, collect evidence and objects, solve puzzles, connect clues on a deduction board, ask the black cat
**Noctaviae** for hints over Moroccan tea, and present a supported conclusion. Playable in **Moroccan Darija,
Modern Standard Arabic, French and English** (Arabic and Darija right-to-left).

**Live site (GitHub Pages):** https://khalidbouzrhaiba.github.io/Noc2/

| Case | Premise |
| --- | --- |
| **The Last Broadcast** | A journalist vanishes after her late-night show is cut. The official story blames a power failure. |
| **The Hollow Harvest** | At the harvest festival the bell rings at the wrong times, lights die, and the crowd freezes as one. |
| **The House with No Address** | A house appears in old maps and photographs but in no current register. |

## Quick start

Requires **Node.js 20+** (tested with Node 22).

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit, content, i18n-audit, persistence and SQL tests (Vitest + PGlite)
npm run build      # production build in dist/
npm run preview    # serve dist/ at http://localhost:4173
```

The production build is static and works offline once loaded. Fonts are bundled. All sound is synthesized
in the browser (Web Audio), so there are no audio files; the game is fully playable with sound off.

## How to play

- **Title → case files → radio → blackout → town → investigation.** The case is chosen *before* the radio
  announcement, which is specific to that case.
- Click/tap objects in the scene, or use the list under it (keyboard friendly). Badges show *New*, *Changed*,
  *Locked*, *Puzzle*, *Solved* and *Optional*.
- **Map**: travel; markers show where you are, new things, open leads, visited and locked places.
- **Notebook**: evidence (verified / unverified / rumour), the **deduction board** (pick two pieces that explain
  each other → *Connect*) and contradictions.
- **Inventory**: choose an item → *Use on…* → pick an object.
- **Noctaviae**: three hint levels per puzzle (Nudge 20, Relationship 35, Strong guidance 50 hint points by
  default). Hints cost hint points only — never the case score.
- **Conclude** (when available): answer the final deduction from evidence you actually found. Outcomes:
  incomplete (keep investigating), partially supported, strongly supported.

## Project structure

```
src/
  core/        i18n (locales, direction, missing-translation detection), settings, synthesized audio
  core/locales UI strings (ui.js) and event/admin strings (events.js), each in dar/ar/fr/en
  content/     case data: broadcast.js, harvest.js, house.js (story bible + data), noctaviae.js, index.js (validator)
  game/        engine.js (pure rules), conditions.js, config.js (economy), persistence.js, GameProvider.jsx (store)
  screens/     Title, CaseSelect, Radio, Reveal, Game, Ending, Events, Admin
  ui/          Scene, Puzzle, Notebook, Inventory, MapView, HintScene, FinalDeduction, Leaderboard, Modal, …
  art/         original SVG art: Noctaviae, townscape, radio, 14 backdrops, ~55 props
  events/      event backend client: api.js, supabaseAdapter.js, devAdapter.js (dev only), sync.js, rules.js, canon.js
supabase/migrations/   001_noctaviae.sql (schema + RPCs), 002_canon.sql (GENERATED canonical rules)
tests/         Vitest suites (engine, cases, persistence, i18n audit, events, SQL in PGlite, audio)
e2e/           browser playthroughs (Playwright): playthrough, persistence, events, a11y
```

### Adding or editing content

Cases are data (`src/content/*.js`). Every object, clue, item, puzzle, deduction and objective has a stable
id; prerequisites use a small condition language (`{ clue }`, `{ item }`, `{ puzzle }`, `{ flag }`,
`{ all: [] }`, `{ any: [] }`, …). Each localized string is `L(darija, arabic, french, english)`.

After changing content:

```bash
npm test             # validates structure, plays every case's scripted walkthrough, audits translations
npm run gen:canon    # regenerate supabase/migrations/002_canon.sql (a test fails if you forget)
```

## Saves, scoring and replay

- Solo saves are **local to the browser** (`localStorage`): one record per case (`noctaviae:case:<id>`),
  versioned and validated on load. Damaged records are repaired where safe or reported with an explicit
  "discard and start fresh" option. This is not a cloud save.
- Score and hint balance are **derived** from recorded facts (claimed rewards and purchases), so refreshes,
  re-opening documents and repeated clicks never award twice.
- Economy values live in `src/game/config.js`.
- **Replay** resets only that case (evidence, items, puzzles, hint points and purchased hints) after a
  confirmation; the best score is kept. Other cases are untouched. Time played is shown but never scored.

## Events, organizers and leaderboards (optional, Supabase)

Solo play needs no server. Online events need a Supabase project that **you** create. Until then, the event
buttons are hidden on the deployed site. (During `npm run dev` a clearly labelled, insecure in-browser
simulation lets you try the event and admin screens; it is not included in production builds.)

### Setup

1. Create a project at https://supabase.com.
2. **Authentication → Sign In / Providers**: enable **Anonymous sign-ins** (players) and **Email** (organizers).
3. **SQL Editor**: run `supabase/migrations/001_noctaviae.sql`, then `supabase/migrations/002_canon.sql`
   (or `supabase db push` with the Supabase CLI).
4. **Authentication → Users → Add user**: create the organizer account (email + password).
5. Make that user an organizer (SQL Editor):
   ```sql
   insert into noct.admins (user_id) values ('<organizer user uuid>');
   ```
6. Add the project's public values:
   - locally: copy `.env.example` to `.env` and fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`;
   - for GitHub Pages: **Settings → Secrets and variables → Actions → Variables** with the same names, then
     re-run the deploy workflow.
   Never use the `service_role` key in the app.
7. Organizers sign in at `<site>/#/admin`, create an event (cases, hint costs, starting points, capacity,
   dates), then **Open for joining** → **Start**. Players use **Join an event** with the access code and a
   display name (the only personal data collected).

### What the server enforces

- No client can read or write tables directly (RLS enabled, no policies, no grants); everything goes through
  `SECURITY DEFINER` functions that check `auth.uid()`, membership and event state.
- Admin functions require the caller to be in `noct.admins`; hiding buttons is not relied on.
- Puzzle answers and final solutions are checked server-side against canonical data that clients cannot read
  (answers in all four languages; the same normalization as the client).
- Every reward's prerequisites (derived from the case content) are checked against the player's recorded
  claims; unknown ids, other cases and impossible orders are rejected; points come from the server's own table.
- Each claim, hint and completion carries a transaction id; replays and double submissions are no-ops.
  Hint balances are computed and locked server-side; a hint is shown only after the server confirms it.
- Event lifecycle: draft → scheduled → open → active ⇄ paused → completed / cancelled (enforced transitions).
- Leaderboard: validated scores only; ties broken by cases completed, then who reached the score first, then
  join time. It shows display names, scores and cases only. It refreshes by polling every 20 s (not
  real-time).
- Audit log of event creation/updates, status changes, joins, completions, resets and exports. CSV export
  contains rank, display name, score and cases completed, with spreadsheet-formula escaping.
- Simple rate limit (40 game actions per member per 10 s by default).

### Known limitations (honest list)

- Exploration rewards are validated for order and prerequisites, not for "having looked at the screen": a
  determined player could script valid claims, but never beyond the canonical totals, and puzzle/final
  answers must still be correct.
- Anonymous players can create several identities if they know an event code; names are unique per event.
- `seen`-type conditions (object looked at before) are not tracked server-side.
- The backend has been tested against real Postgres in PGlite with a stubbed `auth.uid()`; it has **not**
  been run against a live Supabase project from this repository.

## Testing

```bash
npm test                                   # 87 tests incl. the SQL migration in PGlite
# Browser tests (need Playwright: npm i -D playwright && npx playwright install chromium)
npm run build && npm run preview &         # http://localhost:4173
npm run e2e:play -- http://localhost:4173/ en               # all three cases through the UI
npm run e2e:play -- http://localhost:4173/ dar broadcast 390x844
npm run e2e:saves -- http://localhost:4173/
npm run e2e:a11y -- http://localhost:4173/ en,ar
npm run dev -- --port 5175 &                # dev server (event simulation)
npm run e2e:events -- http://localhost:5175/
```

## Deployment (GitHub Pages)

The workflow `.github/workflows/deploy.yml` runs the tests and the build on every push to `main`, then
publishes `dist/` to the `gh-pages` branch, which GitHub Pages serves (**Settings → Pages → Deploy from a
branch → gh-pages**). Asset paths are relative and the only route (`#/admin`) is a hash, so no server
rewrites are needed.

## Troubleshooting

- **Progress disappeared**: saves are per browser and per device; private windows don't keep them.
- **"Saving isn't available"**: the browser blocks storage (e.g. strict privacy mode); play continues but
  won't persist.
- **No sound**: sound starts only after you press a button (browser autoplay rules) and can be toggled in the
  title or menu.
- **Event buttons missing**: the build has no Supabase settings (see setup above).
- **SQL test fails after a content change**: run `npm run gen:canon`.
