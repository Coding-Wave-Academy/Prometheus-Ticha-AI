# Desktop Views for All Pages: Implementation Plan

Give every page a real desktop layout (≥ 1024px) that matches `design/Ticha AI Web View - Dashboard.png` and `design/Ticha AI Web View - Explore.png` where a design exists, and follows `design/Ticha design system.png` where none does. Mobile layouts (< 768px) stay as they are.

---

## 0. Where things stand (audited 2026-11-09 at 1536×1024)

| Page | Desktop today | Design |
|---|---|---|
| `/dashboard` | Real desktop layout; sizes and colours differ from the design (see §3) | ✅ Dashboard |
| `/explore` | Real desktop layout; close to the design | ✅ Explore |
| `/dashboard/*` (11 pages: profile, daily lessons, daily quiz, quiz generator, flashcards, subjects, subject detail, notifications, videos, progress, tutor) | Mobile column, ~420px wide, centred in a ~1300px empty canvas | ❌ none |
| `/past-papers`, `/summaries`, `/practice`, `/leaderboard`, `/courses`, `/coming-soon` | **404 page**: `DeviceGate` blocks them at ≥ 768px. The sidebar's **Past Papers** link leads here. | ❌ none |
| `/login`, `/register`, `/getting-started/*` | Mobile column centred on desktop | ❌ (mobile designs only) |

Other findings:
- **Wrong item highlighted in the sidebar:** Daily Quiz highlights *Explore*; Flashcards, Subjects and Notifications highlight *Home*; Profile highlights *Settings*.
- **The two desktop designs disagree** on the shell: the Dashboard design has a tall sidebar with no tagline or promo card, and a header with streak + avatar only. The Explore design has the tagline, a compact list, the promo card, and a header with avatar + greeting + streak + bell. The current code follows the Explore version.
- **The designs disagree on typography:** the design system specifies Plus Jakarta Sans for H1–Caption, the mobile Login design uses a rounded face, and the code uses Baloo 2 for headings and buttons.
- **The palette has drifted:** the design system's primary is `#C8FF2A` and its background `#FFF8F1`. The code mostly uses `#B6FF00` (166 times) and `#FAF7EC` (71 times). There are 774 hard-coded hex classes in `src/`, against the `AGENTS.md` rule to use tokens.

## 1. Scope

### In scope
1. **Design tokens in Tailwind v4 `@theme`** (`globals.css`): colours (primary, secondary, ink, cream, pink, the semantic colours, card tints), radii (8/12/16/20/24/32), shadows (the design system's small/medium/large, plus the neo-brutalist hard offsets `3px 3px 0 #0A0A0F` etc.), and the type scale (H1 32/120% Bold … Caption 12/150% Medium). Classes like `bg-primary`, `shadow-brutal-md` and `text-h2` replace arbitrary values **in every file this plan touches**. Untouched files keep their hex values for now; a separate sweep can finish the job.
2. **One desktop shell**, `src/components/layout/AppShell.tsx`: sidebar + header + content area, used by every signed-in page. Sidebar width 272px; content max-width 1200px with a 48px gutter. The header has two variants that match the two designs: `greeting="large"` (Dashboard) and `greeting="inline"` (Explore and everything else).
3. **Pixel-match `/dashboard` and `/explore`** against their designs: a measured overlay comparison at 1536×1024, with every element within ±4px and the exact token colours.
4. **Desktop layouts for the pages without a design**, built from the design system's components and the layout grammar of the two desktop designs: section titles at H2, cards on a 12-column grid, hard-shadow cards. Each layout uses the extra width for real content instead of stretching the mobile column:

| Page | Desktop layout |
|---|---|
| Daily lesson | Two columns: video and lesson on the left (8 cols); key insights and the "test yourself" steps on the right (4 cols) |
| Daily quiz / quiz generator | Question card centred (7 cols), with progress, timer and the answer list beside it (5 cols) |
| Flashcards | Large card centred, keyboard controls (←/→ flip/next, 1/2 review/got it), deck progress in a side rail |
| Subjects | Responsive card grid (3–4 per row); subject detail = syllabus checklist (8 cols) + mastery card (4 cols) |
| Past papers | Filter bar on the left (level, subject, year); paper cards in a 3-column grid; detail modal as a side panel |
| Summaries | Subject/topic list (4 cols) + reader (8 cols) |
| Profile | Two columns: identity + badges / account settings |
| Notifications | List of up to 720px width, with filters |
| Videos, practice, leaderboard, courses, progress, tutor | Same grid; "coming soon" states centred inside the shell instead of on a blank page |
| Login / register / onboarding | Split screen: brand illustration panel on the left, form on the right (480px) |

5. **Remove the 404 gate** from `DeviceGate` once each route has its desktop layout, and delete `DeviceGate` when none are left.
6. **Fix the sidebar highlighting**: work out the active item from a route→section map, not by exact `href` match.

### Non-goals
- Changes to mobile layouts, except where shared components get token classes (no visual change intended)
- New features: the "coming soon" pages stay "coming soon"
- Dark mode

## 2. Schema / API changes
None.

## 3. Dashboard: differences from the design (to fix)
- Headings use Baloo 2; the design uses Plus Jakarta Sans Bold (H1 "Hello, Ribert" ≈ 40px).
- The daily lesson card is saturated `#B6FF00`; the design uses a pale lime tint with a soft green border and an illustrated book.
- The streak card day tiles are 40px; the design's are ≈ 64px with a lime fill for today.
- The quick-action circles are 64px; the design's are ≈ 92px with 2px borders.
- The progress card lacks the bar fill and the right-aligned % pill style from the design.
- The streak pill in the header is lime; the design's is a white pill with a black border and an orange flame.
- Sidebar items are 48px tall in the code and ≈ 72px in the Dashboard design, but compact in the Explore design. **To be decided: see question 1.**

## 4. Files

**New**
- `src/components/layout/AppShell.tsx`, `src/components/layout/AppHeader.tsx`
- `src/components/layout/navSections.ts` (route → sidebar section map)
- `src/components/ui/SectionTitle.tsx`, `src/components/ui/IconCircle.tsx`, `src/components/ui/HubCard.tsx` (pulled out of the Explore page for reuse)

**Modified**
- `src/app/globals.css` (tokens), `src/app/layout.tsx` (fonts, if question 2 changes them)
- `src/components/layout/DashboardSidebar.tsx`, `src/components/layout/DeviceGate.tsx` (then removed)
- `src/app/dashboard/layout.tsx` → uses `AppShell`; new `layout.tsx` files for `/past-papers`, `/summaries`, `/practice`, `/leaderboard`, `/courses`, `/explore` so they share the shell
- Every page listed in §1.4, desktop section only (`lg:` variants alongside the existing mobile markup, or a `DesktopX` component next to the mobile one when the structure differs too much)

## 5. Offline and service-worker considerations
- No new runtime requests. The shell and layouts are static markup, so pages the service worker cached keep working offline.
- Font changes (question 2) change the `/_next/static/media` file names. The service worker caches them on first load; the old font files stay in `ticha-pwa-v4` until the next version bump. The offline plan will prune old entries.
- Illustrations for the split-screen auth pages: SVG/WebP under 40 KB each, lazy-loaded below 1024px so phones never download them.

## 6. Security
- No new API calls or data. `DeviceGate` removal only changes rendering. Protected routes are still enforced by the proxy (the `/dashboard/*` redirect from the auth hardening work).

## 7. Delivery in phases (one PR each, so each can be reviewed and shipped)
1. **Tokens + AppShell + sidebar fix**, applied to the dashboard and explore → pixel-match both designs.
2. **Unblock the 404 pages:** past papers, summaries, practice, leaderboard, courses get desktop layouts; remove those routes from `DeviceGate`.
3. **`/dashboard/*` study pages:** daily lesson, quiz, quiz generator, flashcards, subjects, subject detail.
4. **Account pages and auth:** profile, notifications, videos, progress, tutor, login, register, onboarding. Delete `DeviceGate`.

## 8. Acceptance criteria
- [ ] At 1536×1024, `/dashboard` and `/explore` match their designs within ±4px (overlay screenshots attached to the PR).
- [ ] At 1024, 1280, 1536 and 1920px wide, no page shows a 404, a stretched mobile column, horizontal scrolling or overlapping elements.
- [ ] At 375px (mobile), screenshots of every page are unchanged compared with `main` (pixel diff ≤ 0.5%), except for the token colour change if question 3 changes the primary colour.
- [ ] The sidebar highlights the right item on every route.
- [ ] Keyboard: every sidebar item, card and button can be reached with Tab and shows a visible focus ring; flashcard shortcuts work.
- [ ] Files touched contain no arbitrary hex classes (`grep -E '\[#[0-9A-Fa-f]{6}\]'` on changed files returns nothing).
- [ ] `tsc --noEmit`, `eslint`, `next build` pass.

## 9. Manual testing steps
1. Open each route at 1536×1024 and 1280×800 in Chrome while signed in; compare with the designs and the layouts in §1.4.
2. Shrink the window from 1920px to 375px on `/dashboard`, `/explore`, `/past-papers` and `/dashboard/daily-lessons`; the layout should switch cleanly at 768px and 1024px.
3. Go offline after visiting `/dashboard` and `/explore`; both still render inside the shell.

## 10. Decisions needed before starting
1. **Which sidebar and header are correct:** the Dashboard design's (tall items, no promo card) or the Explore design's (compact, tagline, promo card, bell)? *Recommendation: the Explore version for every page, because it's newer, already built, and holds more navigation.*
2. **Heading font:** Plus Jakarta Sans for everything (as the design system sheet and the desktop designs specify), or keep Baloo 2 for headings and buttons (as the code does)? *Recommendation: Jakarta. It's what both desktop designs use.*
3. **Primary lime:** `#C8FF2A` (design system) or `#B6FF00` (what students see today)? Mobile changes too. *Recommendation: `#C8FF2A`.*
4. **Pages with no design:** build the layouts in §1.4 from the design system, then have the designer review screenshots? Or wait for designs? *Recommendation: build now; the designer reviews each phase's PR.*
