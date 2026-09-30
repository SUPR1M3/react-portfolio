# Performance Plan

Tracking doc for two issues: slow initial render, and jank/jerks when switching between sections quickly. Work through items top-to-bottom, one at a time, reviewing each before moving to the next — same process as `VIEWPORT_AND_BUGFIX_PLAN.md`.

**Architectural context that shapes this whole plan**: this site isn't really "pages" — `App.jsx` mounts Hero, Skills, Projects, and Contact *all at once* inside `.horizontal-scroll-container`, and "switching pages" is just a scroll-snap between sections that are already rendered. That means every section's animations (Projects' CSS marquee, Skills' 3-second auto-rotate, the liquid cursor's RAF loop) run continuously **all the time**, regardless of which section is actually visible — so the browser is always juggling multiple expensive animations, and that competition is the most likely cause of jank specifically when scrolling between sections.

I don't have browser/Lighthouse access this session, so priority order below is based on static evidence (file sizes, DOM node counts, CSS cost) rather than a profiler trace. Lower-numbered items are the safest, most clearly-justified wins; verify each visually before moving on, same as before.

---

## 1. Compress the oversized project icon images — ✅ DONE

**Evidence**: several images displayed at a **64px** icon size (`.cardImage { width:64px; height:64px; }` in `ProjectsStyles.module.css`) are wildly oversized on disk:

| File | Size | Displayed at |
|---|---|---|
| `SpaceShip.png` | 839 KB | 64px |
| `BookLetterIcon.png` | 640 KB | 64px |
| `ReelGoodIcon.png` | 191 KB | 64px |
| `Covfefe.png` | 168 KB | 64px |

All of these are eagerly fetched on initial load (the `<img>` tags are in the DOM immediately — Projects is always mounted, not lazy) regardless of whether the visitor ever scrolls to that section. That's ~1.8MB of unnecessary image weight on every page load, for icons that only need to look good at 64-128px.

- [x] Resized each to max 256px (retina headroom for a 64px display size) and re-exported as WebP via Python/Pillow (installed for this session), same treatment as the existing `hero-img.webp`:
  | File | Before | After |
  |---|---|---|
  | `SpaceShip.png` → `SpaceShip.webp` | 839 KB | 19.6 KB |
  | `BookLetterIcon.png` → `BookLetterIcon.webp` | 640 KB | 13.6 KB |
  | `ReelGoodIcon.png` → `ReelGoodIcon.webp` | 191 KB | 15.4 KB |
  | `Covfefe.png` → `Covfefe.webp` | 168 KB | 19.2 KB |

  Total: 1838 KB → 67.7 KB (96% reduction, ~1.77 MB saved on every initial load).
- [x] Updated the imports in `Projects.jsx` to point at the new `.webp` files.
- [x] Deleted the now-unreferenced original PNGs (`git rm`) so they don't linger as dead weight.
- [x] Verified with `npm run build` — the huge PNGs no longer appear in `dist/assets` at all, replaced by the small WebP files.
- [x] **User confirmed**: icons look fine.

---

## 2. Memoize sibling section components — ✅ DONE

**Found while investigating "jerks specifically when switching to Skills"**: none of the 9 components `App.jsx` renders directly (`Hero`, `Skills`, `Projects`, `Contact`, `Footer`, `MoreNavigation`, `ResumePreview`, `LiquidCursor`, `LiquidContainerSwitch`) were wrapped in `React.memo` — confirmed via `grep -rn "React.memo" src/`, zero matches before this change. That means every time `App`'s `activeSection` state changed (on every scroll transition between sections), React re-rendered **all** of them, even though none of them actually consume `activeSection` as a prop. Skills is by far the most expensive of the group to re-render — 12 cards each recalculating a 3D position via `getCardPosition()` and each carrying a `backdrop-filter` blur — so this cascade was landing a disproportionate chunk of extra paint work right at the midpoint of the scroll-snap animation, which lines up with jank being most noticeable around Skills specifically.

- [x] Wrapped all 9 components' default exports in `React.memo(...)`. Two of them (`ResumePreview.jsx`, `LiquidContainerSwitch.jsx`) used an inline `export default function X()` pattern that had to be split into a named function + a separate `export default React.memo(X);` line first.
- [x] Confirmed this doesn't break anything that relies on internal state/context — `React.memo` only blocks the *parent-cascade* re-render, not a component's own state or context updates (Skills' auto-rotate interval, ResumePreview's context-driven open/close, theme changes via `useTheme()`, etc. all still trigger their own re-renders normally).
- [x] Verified with `npm run build` — no errors.
- [x] **User checked**: still noticeably slow switching to Skills. Memoization alone wasn't enough — moved to item 3.

---

## 3. Pause off-screen section animations — ✅ DONE (partial help expected, see note)

**Evidence**: `Projects`' wall uses `animation: wallScroll 40s linear infinite` on 60 DOM nodes (see item 5), and `Skills` runs a `setInterval(..., 3000)` auto-rotation — both kept running (and Skills kept re-rendering all 12 cards' 3D transforms) even when their section was scrolled off-screen, since nothing ever unmounted or paused them. `App.jsx` already tracks which section is active (`activeSection` state).

- [x] Passed `isActive` from `App.jsx` to `Skills` (`activeSection === 1`) and `Projects` (`activeSection === 2`).
- [x] `Projects`: `.wallTrack` now gets `style={{ animationPlayState: isActive ? 'running' : 'paused' }}` — stops the compositor from continuously blurring 60 elements while the section isn't visible. Pausing/resuming `animation-play-state` doesn't reset progress, so no visual jump when it resumes.
- [x] `Skills`: the auto-rotate `useEffect` now also checks `isActive` before starting the `setInterval`, so it stops advancing (and stops the resulting 12-card re-render) while off-screen, and resumes respecting the existing `isAutoRotating` toggle.
- [x] Verified with `npm run build` — no errors.
- [ ] **Needs your visual check.** Important caveat: this fixes *background/steady-state* load (animations running forever while you're not even looking), not necessarily the *one-time arrival cost* of painting 12 `backdrop-filter` elements the instant they scroll into view for the first time in a while — that's item 4 below, which is the more likely fix if jank persists specifically at the moment of arrival rather than during a longer visit.

---

## 4. Scope down `backdrop-filter` usage — Skills done, Projects pending your call

**Evidence**: `backdrop-filter` is one of the most expensive CSS properties to composite (it re-samples/blurs whatever is behind the element, every frame it's on screen or animating). Was:
- **Skills**: *every one* of the 12 cards had it — the active card via `.cardFront { backdrop-filter: blur(20px); }` and all 11 background cards via `.cardFrontInactive { backdrop-filter: blur(10px); }`.
- **Projects**: every one of the 60 wall-card elements has `backdrop-filter: blur(20px)` on `.cardFront` (`ProjectsStyles.module.css:109`).

- [x] **Skills**: removed `backdrop-filter` from `.cardFrontInactive` (the 11 non-centered cards) — kept it only on the single active/centered `.cardFront`. Background there is already 60-80% opaque with the skill's own color, so the blur-behind was doing very little visible work while costing 11x the compositing. Build verified.
- [x] **User confirmed**: looks better now.
- [ ] **Projects — not changed yet, flagging first**: unlike Skills, Projects has no active/inactive split — all 60 wall cards share the exact same `.cardFront` style, and its background is much more transparent (`rgba(255,255,255,0.25/0.15)` vs. Skills' 0.6-0.8), so the blur is doing more real visible work there and removing it would change the "glassmorphic" look across the whole wall uniformly, not just trim a few less-important elements. Wanted your go-ahead before touching that one, given the bigger visual trade-off. Say the word and I'll do the same treatment (drop the blur, maybe bump the background opacity a bit to compensate) and you can judge the look.

---

## 5. Reduce Projects wall DOM node count — ✅ DONE

**Evidence**: `Projects.jsx` tripled `baseProjects` (10 items) to 30 "for density," then rendered that list **twice** in the JSX for seamless looping — 60 `<article>` elements total, each with the `backdrop-filter`/`filter: blur()` combo, all animating via the same CSS keyframe continuously.

**Correction to the original plan**: my first idea (drop the multiplier from 3x to 2x = 20 items) turned out to be mathematically broken — `.wallTrack` is a 3-column grid, and the seamless-loop technique (`translateY(-50%)` with the list duplicated) only lines up cleanly when the list length is a multiple of 3; 20 isn't (10 is ≡1 mod 3, so only multiples of 3 repeats keep it clean), so that would've introduced a ragged row and a visible jump at the loop point.

- [x] **User's fix**: instead of a full 3rd repeat of all 10 projects (the original 30), add one extra copy of a single project (**Base Transformer**) to round 20 up to 21 — also a clean multiple of 3 (7 rows exactly), so the loop stays seamless and the existing `nth-child(3n+2)` Pinterest-stagger rule stays correctly aligned too (21 mod 3 = 0, so the column pattern carries over cleanly across the two rendered halves).
- [x] Total DOM nodes: 60 → 42 (30% reduction) — smaller than the originally-hoped-for cut, but the only option that keeps the existing 3-column layout and stagger effect untouched (a 2-column redesign would've gotten to 20 nodes but changes the wall's visual density/layout, which wasn't wanted here).
- [x] Verified with `npm run build` — no errors.
- [x] **Generalized on request**: the padding count (`shortfall`) is now computed automatically from `baseProjects.length` and `WALL_COLUMNS`, instead of a hardcoded "add 1 copy" — verified by simulation that it stays a clean multiple of 3 for 10, 11, 12, and 13 base projects (shortfalls of 1, 2, 0, 1 respectively). Adding up to 3 more projects to `baseProjects` now needs no other changes; `WALL_COLUMNS` and the `EXTRA_APPEARANCE_ORDER` preference list are commented in `Projects.jsx` for the one thing (grid column count) that still needs manual sync if that's ever changed.
- [x] **User confirmed**: loops fine, extra Base Transformer copy not noticeable.

---

## 6. Minor: stop the liquid cursor's RAF loop when idle — ✅ DONE

**Evidence**: `LiquidCursor.jsx`'s `requestAnimationFrame` loop ran forever unconditionally once mounted, even when the mouse hadn't moved and the trailing balls had already converged to the cursor position — continuously writing to 4 elements' inline styles every frame for no visible change.

- [x] Added an `isSettled()` check (all 3 balls within 0.5px of their target) that stops scheduling further frames once everything has caught up, and an `isRunning` flag so `handleMouseMove` only restarts the loop if it isn't already going (avoids queueing duplicate RAF chains from rapid mousemove events).
- [x] Verified with `npm run build` — no errors.
- [x] **User confirmed**: feels the same.

---

## 7. Bigger option, flagged for discussion — not started by default

**True lazy-mounting of non-Hero sections** (`React.lazy`/`Suspense`, or simply not rendering `Skills`/`Projects`/`Contact` until the user has scrolled near them) would be the single biggest win for *initial* render speed and would eliminate the "everything always animating" problem at its root, since off-screen sections wouldn't exist in the DOM at all until needed.

This is a real UX trade-off, not just a technical toggle: right now scrolling to any section is instant (everything's pre-rendered); lazy-mounting would need some kind of brief loading state the first time you scroll to a not-yet-mounted section, and the "always animating" fixes in items 3-4 become less necessary if this is done instead. Not doing this by default — flagging it in case you'd rather tackle this instead of (or in addition to) items 3-5.

---

## Testing notes

I don't have Lighthouse/DevTools access this session, so "verification" for each item above is: rebuild (`npm run build`), eyeball the change, and — where relevant — describe what you're seeing so I can tell if it matches what the change should have done. If you have access to Chrome DevTools' Performance/Lighthouse tabs on your end, a before/after trace while scrolling between sections would be the most convincing way to confirm items 2-5 actually helped.
