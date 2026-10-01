# Viewport & Bugfix Plan

Tracking doc for two work items: the Projects-page shadow cutoff bug, and overall window/viewport adaptability (including a dedicated mobile landing page). Work through items top-to-bottom, one at a time, reviewing each before moving to the next. Check items off as they land.

Decision on record: for small viewports, we build a **minimal standalone mobile landing page** (photo, name, title, bio, social links, resume, contact link) rather than reflowing the full desktop content — see item 4 below.

---

## 1. Fix Projects-page top shadow cutoff — ✅ DONE

**File(s)**: `src/sections/Projects/ProjectsStyles.module.css`

**What actually shipped** (simpler than the original plan below): left `.wallViewport::before`'s position/size untouched (`left:0; right:0`, 64px tall, scoped to `.wallViewport`) and added `mask-image`/`-webkit-mask-image: linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)` so the band's own left/right edges fade out gradually over a wide 30%-per-side transition instead of ending in a hard vertical line. Confirmed working by the user.

- [x] Fade the band's own left/right edges so they dissolve instead of cutting hard (via wide `mask-image`, not a width/edge-to-edge change).
- [x] Verified visually by the user; change pushed.

<details>
<summary>Original plan (superseded — kept for reference)</summary>

**Root cause (as first understood)**: `.wallViewport::before` only fades vertically and is sized against `.wallViewport`/`.wallWrapper` (`max-width: 1300px`, centered) instead of the true viewport edges.

- [ ] ~~Move the fade overlay so it spans the true viewport width (`left: 50%; width: 100vw; transform: translateX(-50%);`)~~ — tried, didn't fix the reported issue (turned out unrelated to width) and was reverted.
- [ ] ~~Increase band height to cover the `--card-offset: 120px` Pinterest-stagger~~ — tried, made things worse and was reverted.
- [x] Add a horizontal mask fade so the band's left/right edges dissolve — this alone is what fixed it.

</details>

---

## 2. Fix rainbow-disc misalignment behind the More menu — ✅ DONE

**File(s)**: `src/common/MoreNavigation.css` (`.more-navigation::before`, lines ~216-244)

**Root cause**: the disc was sized with `width: 48%; aspect-ratio: 1; height: auto;` — a percentage + `aspect-ratio` box that wasn't guaranteed to recompute in lockstep with the `clamp(..., vw, ...)`-driven `--nav-size` custom property that every sibling (`.more-trigger` at 41%, the SVG stage) uses. This caused visible drift between the disc and the sphere as the window was resized.

- [x] Replaced the `%`/`aspect-ratio` sizing with explicit `calc()` off the same custom property: `width: calc(var(--nav-size) * 0.48); height: calc(var(--nav-size) * 0.48);`.
- [x] Verified by the user by drag-resizing the window through the full width range — disc stays concentric with the sphere throughout.

---

## 3. Add a dedicated mobile landing page — ✅ DONE

**New file(s)**: `src/common/useIsMobile.js`, `src/sections/MobileLanding/MobileLanding.jsx` + `MobileLandingStyles.module.css`
**Modified file(s)**: `src/App.jsx`

- [x] `useIsMobile()` hook using `window.matchMedia('(max-width: 768px)')`, updates on resize/orientation change.
- [x] Built `MobileLanding.jsx`: static, scrollable page (its own `overflow-y:auto`, since body has `overflow:hidden` globally) with profile photo, name/title, bio, social links (same 3 hrefs as desktop `Hero`), a plain round theme-toggle button, a resume **download** link (skips the iframe preview), the existing `Contact` form reused as-is (EmailJS, no exposed email address), and `Footer`.
- [x] Excluded on mobile: `LiquidCursor`, the 3D `Skills` carousel, the `Projects` marquee wall, `MoreNavigation` radial menu, `LiquidContainerSwitch`'s water animation.
- [x] Wired into `App.jsx`: `useIsMobile()` called unconditionally (hooks-safe), early `return <MobileLanding />` below 768px, full desktop tree unchanged above it.
- [x] Verified: `npm run build` and existing lint both pass; user confirmed working on device-width testing and pushed.

---

## 4. Standardize responsive breakpoints (narrowed scope) — ✅ DONE (core issue fixed)

**File(s)**: `src/App.css`, `src/sections/Contact/ContactStyles.module.css`, `src/sections/Hero/HeroStyles.module.css`, `src/sections/Skills/SkillsStyles.module.css`, `src/sections/Projects/ProjectsStyles.module.css`, `src/common/MoreNavigation.css`, `src/common/ResumePreview.css`

**Problem**: breakpoints are inconsistent — `App.css`/`Contact`/`Hero` use mobile-first `width>=800px` / `width>=1400px`; `Skills`/`Projects`/`MoreNavigation`/`ResumePreview` use desktop-first `max-width: 768px / 480px / 1280px`.

**Narrowed scope (decided after item 3 lands)**: only the tablet/small-laptop range above the mobile-landing cutoff still matters — that range keeps rendering the full desktop layout. The phone-specific rules (`max-width: 480px`, and `max-width: 768px` rules that only exist to patch phone rendering) become unreachable once `MobileLanding` takes over below that cutoff, so those should be identified and cleaned up/removed rather than "aligned."

- [x] Audited every `max-width`/`min-width` rule in the files above.
- [x] Removed dead phone-only blocks that can never run now that `MobileLanding` owns everything ≤768px: `ProjectsStyles.module.css` (`max-width:768`), `MoreNavigation.css` (`max-width:768`), `ResumePreview.css` (`max-width:768` + `max-width:480`), `SkillsStyles.module.css` (two separate `max-width:768` blocks + two separate `max-width:480` blocks — this file had the rule duplicated). Left a short comment in each spot explaining why there's no phone-width rule there. Verified with `npm run build` — CSS bundle shrank, no errors.
- [x] **Hero 769-799px gap — confirmed and fixed.** User found it visually: at that width, Hero's `.heroImageContainer` (absolutely centered behind the text, `z-index:-1`, designed for real phone widths) collided with the text block, since that "mobile-style" CSS was only ever reachable in that narrow, never-a-real-device sliver once `MobileLanding` took over actual phones. Fixed by moving `HeroStyles.module.css`'s row-reverse breakpoint from `width>=800px` to `width>=769px` — the desktop side-by-side layout now applies at the very first width the desktop tree can ever render at, so the stacked/overlapping layout is never shown. User confirmed fixed.
- [ ] **Remaining open, still not breaking anything**: `App.css`/`Contact`'s own `width>=800px`/`width>=1400px` (font-size scaling only, not layout) haven't been touched — no reported issue there. `Skills`' `max-width:1280px` and `Projects`' `769-1199`/`min-width:1200` are unrelated concerns (column-count/ring-compression) using their own deliberate numbers. Leaving all of these as-is per user's direction: only chase this further if something actually looks broken.
- [ ] Migrating `max-width` files to `min-width` direction was in the original plan; skipped as high-risk/low-value once the dead code above is gone — the remaining rules aren't the "same breakpoint expressed two ways" problem this was meant to solve. Can revisit if you disagree.

---

## 5. Harden resize edge cases — ✅ DONE

**File(s)**: `src/App.jsx` (modified), `src/common/MoreNavigation.jsx` (reviewed, no change), `src/sections/Skills/Skills.jsx` (reviewed, no change)

- [x] `App.jsx`: added a debounced (150ms) `resize` listener that re-snaps `container.scrollLeft` to `activeSection * window.innerWidth` (instant, not smooth) once the resize settles — before this, dragging a desktop window narrower/wider left `scrollLeft` pointing at the *old* width's offset, landing visually mid-section instead of on the active one.
- [x] `MoreNavigation.jsx`'s `getScrollLeftForSection` already reads `window.innerWidth` live at call time (not cached), so it stays consistent with the resize fix above automatically — no change needed.
- [x] Reviewed `Skills.jsx`'s `ResizeObserver`-driven `ringMetrics`: `cardWidth`/`cardHeight`/`radius` are all floored (160px/176px/90px minimums) so they can never go negative or `NaN`. At the narrowest surviving width (769px, right after the mobile cutoff) the floored 160px card width still comfortably fits the ~377px carousel container — no overflow there. The one remaining theoretical case is an extremely *short* window (<~200px tall) where the floored 176px card height could exceed the container's actual height; `.container` has `overflow: hidden`, so the worst case is a card getting clipped rather than a broken layout. Not fixing speculatively since I can't verify visually and it degrades gracefully — flag it if you actually hit it.
- [x] Verified with `npm run build` — no errors. User confirmed the resize behavior looks correct.

---

## 6. Full test pass

- [ ] Manually test at: 375px, 480px, 768px, 1024px, 1440px, 1920px+.
- [ ] Drag-resize live through each threshold (not just fixed widths) to catch transition glitches.
- [ ] Test both themes at each size.
