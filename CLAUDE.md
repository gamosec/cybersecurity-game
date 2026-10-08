# CLAUDE.md — Cyber Security Escape Room (Arabic)

Arabic (RTL) browser game for cyber-security awareness. **Pure static HTML/CSS/JS — no build step, no dependencies.**
All artwork is drawn in code as inline SVG. Live: https://gamosec.github.io/cybersecurity-game/ (GitHub Pages from `main`, repo `gamosec/cybersecurity-game`, public).

**The user writes in Arabic — reply in Arabic.** Docs under `docs/` are in Arabic (identifiers/code in English).

## Read first (in this order, only what you need)
1. `docs/STATUS.md` — current state, what's done, open items, ideas, a paste-ready starter prompt. **Read this first.**
2. `docs/ARCHITECTURE.md` — files, load order, data model, engines, rendering, CSS layers.
3. `docs/CONTENT-GUIDE.md` — how to add a scenario/mission, content rules, drawing recipes.
4. `docs/LESSONS.md` — bugs we already hit (RTL SVG text, duplicate SVG ids, hit areas, caching…). Skim before touching rendering/CSS.
5. `docs/ANSWER-KEY.md` — correct answers. **Only read when editing/reviewing content.** Never paste it to players.
6. `docs/DEPLOY.md` — branches, version bump, publishing, verification.

## Commands (run from repo root)
```bash
node tools/check-content.js        # static checks, ~1s, no browser. RUN BEFORE EVERY COMMIT.
node tests/e2e.js                  # full browser suite (all scenarios x desktop/phone x pass/fail), ~2.5 min
node tests/e2e.js --only red-blue --modes desktop        # one scenario, fast
node tests/e2e.js --url https://gamosec.github.io/cybersecurity-game/   # test the live site
python3 -m http.server 8000        # or just open index.html (file://)
```
Playwright is preinstalled in the cloud env (`/opt/node22/lib/node_modules/playwright`, Chromium in `/opt/pw-browsers`; do **not** run `playwright install`). Screenshots: `node tests/e2e.js --shots <dir>` then Read the PNGs to review visuals — **always look at the rendering after changing graphics/CSS**; tests can't judge looks.

## Architecture in 10 lines
- Namespace `window.CyberEscape` (`CE`). Scripts load in a fixed order in `index.html` (`core, iso, icon-lib, audio, missions, journeys, scenarios…, upcoming, game` — `game.js` last).
- `js/core.js` registry (`registerScenario`, `getScenario`), utils, small UI icons. `js/iso.js` isometric SVG helper (`Iso`). `js/icon-lib.js` illustrated answer icons. `js/audio.js` WebAudio sounds.
- `js/game.js` = engine for **room scenarios** (menu, intro, hotspot room, popup answers, results). `js/missions.js` = engine for **missions** (Red/Blue team: find station → email → challenges on a computer screen). `js/journeys.js` = engine for **journeys** (one big world, camera moves between scenes; choice / items / wifi kinds; see ARCHITECTURE §5.1).
- Each scenario is ONE file in `js/scenarios/` that calls `CE.registerScenario({...})` with content + `renderScene(iso)` + `renderIntroArt()`.
- Stage is a fixed 1600×900 box scaled with CSS transform; portrait/narrow screens (`aspect < 1.1`) switch to `body.fluid` layout (swipeable scene, bottom-sheet popup).
- State is in-memory; only `localStorage` keys `cyberEscape.best.<id>` and `cyberEscape.sound`.

## Hard rules
- **Content rules (every scenario):** 4 options per challenge; number of correct answers varies (1/2/3/all); wrong options are *real threats that don't apply* (never silly); answer is correct only on exact match; option order is shuffled at runtime; **currency = dinar (دينار) by default, dollar only for international services**; every option needs an icon (rule in `icon-lib.js` or explicit `icon:`).
- **Missions:** never reveal a station's colour/appearance in any text (trainee must find it); no glow on the target; keep decoy stations. Red-team content stays at **awareness level** (choose a *category* of method to understand the gap; every feedback ends with the defensive lesson). No operational attack detail, tool names, or step-by-step instructions.
- **RTL SVG text:** `text-anchor="end"` means the LEFT edge in RTL pages. Use `middle`, or `start` + `direction="rtl"`.
- **SVG ids** must be prefixed per scenario (`s1-`, `s2-`, `m1-`…) — all scene thumbnails render together in the menu.
- **After any change that the browser loads:** bump `?v=N` on ALL tags in `index.html` (checker enforces they match) or phones keep the old JS/CSS.
- Wrap numbers like `3 / 5` in `dir="ltr"` inside RTL text.
- No hover `transform` on clickable cards (causes flicker/unstable clicks).
- Don't create PRs unless asked. Work/push on the designated feature branch; publishing = fast-forward `main` (see `docs/DEPLOY.md`). Never put model names in commits/code.
- Keep the README tables, `docs/ANSWER-KEY.md` and `docs/STATUS.md` in sync with content changes (the checker doesn't verify them).

## Definition of done for a change
1. `node tools/check-content.js` passes. 2. `node tests/e2e.js` (or `--only` for the touched scenario) passes. 3. You looked at screenshots (desktop **and** phone portrait). 4. `?v=` bumped. 5. Docs updated (`STATUS.md` at minimum). 6. Committed, pushed, `main` fast-forwarded, live site re-tested (`--url`).
