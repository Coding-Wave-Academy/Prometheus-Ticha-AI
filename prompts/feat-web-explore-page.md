# Web & Tablet Explore Page — Implementation Plan

Build the **Web & Tablet version of the Explore Hub page** matching the design mockup in `design/Ticha AI Web View - Explore.png`, fully integrated with the left sidebar navigation, live student profile data, responsive layout, search filtering, and route transitions.

---

## 1. Feature Scope & Non-Goals

### In Scope
- **Web & Tablet Explore Page (`src/app/explore/page.tsx`)**:
  - Responsive dual-layout: Web layout on screens $\ge 768\text{px}$ (`md:` breakpoint) and preserved mobile-first layout on screens $< 768\text{px}$.
  - **Top Header**: User avatar + "Hello, {Name} 👋" + live streak pill (`🔥 {count}`) + notification bell (`🔔 {count}`).
  - **Title**: `EXPLORE HUB` (Neobrutalist typography).
  - **Interactive Search Bar**: Real-time filtering of all hub cards with `#965A18` "SEARCH" button.
  - **Core Learning Hub**: 3-column row with large cards:
    1. **Summaries** (`#D3E2FF` light blue) $\rightarrow$ `/summaries`
    2. **Past Papers** (`#FFE7D6` warm peach) $\rightarrow$ `/past-papers`
    3. **Daily Quiz** (`#C8FF2A` lime green) $\rightarrow$ `/dashboard/daily-quiz`
  - **Flashcards & Study Tools**: 4-column row with cards:
    1. **Flashcards** (`#FFB040` orange) $\rightarrow$ `/dashboard/flashcards`
    2. **Upload Materials** (`#C8FF2A` lime green) $\rightarrow$ `/coming-soon` (or materials upload)
    3. **Practice Drills** (`#FFD6E7` soft pink) $\rightarrow$ `/practice`
    4. **AI Practice Bot** (`#D3E2FF` light blue) $\rightarrow$ `/dashboard/tutor`
  - **Social & Competition**: Full-width banner:
    - **Leaderboard** (`#FFB040` orange) $\rightarrow$ `/leaderboard` with trophy watermark and arrow button.
  - **Sidebar Enhancement (`src/components/layout/DashboardSidebar.tsx`)**:
    - Add the bottom motivational card ("Better Every Day, Stronger Tomorrow." with student studying illustration and 1% calendar).
    - Ensure `Explore` item is active when on `/explore`.
  - **DeviceGate Enablement (`src/components/layout/DeviceGate.tsx`)**:
    - Allow `/explore` on desktop/tablet without 404 gating.
  - **No Bottom Navbar on Web/Tablet**:
    - Strictly hidden via `md:hidden`.

### Non-Goals
- Changing the existing mobile Explore view.
- Modifying database schemas (no new Supabase tables needed).

---

## 2. Architecture & Design Alignment

```
┌──────────┬─────────────────────────────────────────────────────────────┐
│          │  👤 Hello, Name 👋                       🔥 17    🔔 (2)   │
│  1% Logo │─────────────────────────────────────────────────────────────│
│  Ticha AI│  EXPLORE HUB                                                │
│  ──────  │  [ 🔍 Search resources, topics...               | SEARCH ]  │
│ Dashboard│                                                             │
│  Explore*│  Core Learning Hub                                          │
│  AI Tutor│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  Video   │  │ 📖 Summaries │ │ 📄 Past      │ │ ❓ Daily Quiz        │ │
│  Papers  │  │   Study notes│ │    Papers    │ │    Test your       │ │
│ Progress │  │   & bites    │ │   GCE & BACC │ │    knowledge...    │ │
│ Settings │  │          (→) │ │          (→) │ │                  (→) │ │
│  ──────  │  └──────────────┘ └──────────────┘ └──────────────────────┘ │
│  Logout  │                                                             │
│          │  Flashcards & Study Tools                                   │
│ ┌──────┐ │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────────┐ │
│ │1% Cal│ │  │ ➕ Flash-│ │ ⬆ Upload │ │ 🎯 Prac- │ │ 🤖 AI Practice  │ │
│ │Study │ │  │    cards │ │   Materi-│ │    tice  │ │    Bot          │ │
│ └──────┘ │  └──────────┘ └──────────┘ └──────────┘ └─────────────────┘ │
│          │                                                             │
│          │  Social & Competition                                       │
│          │  ┌────────────────────────────────────────────────────────┐ │
│          │  │ 🏆 Leaderboard — National & School Rankings   🏆   (→) │ │
│          │  └────────────────────────────────────────────────────────┘ │
└──────────┴─────────────────────────────────────────────────────────────┘
```

---

## 3. Files to Create or Modify

### Modified Files

1. **`src/components/layout/DeviceGate.tsx`**:
   - Add `/explore` to `isWebSupportedRoute`.

2. **`src/components/layout/DashboardSidebar.tsx`**:
   - Add sidebar bottom student motivation card matching design mockup.

3. **`src/app/explore/page.tsx`**:
   - Add responsive Web/Tablet layout (`hidden md:flex`) alongside mobile layout (`md:hidden`).
   - Connect live profile greeting, streak, notifications, and interactive search.
   - Render `DashboardSidebar` for layout consistency.

4. **`docs/CHANGELOG.md`**:
   - Document Web Explore Hub implementation.

---

## 4. Offline-First & Security Considerations

- All cards and links function offline with local cached routes.
- Live data from `useProfile()`, `useStreak()`, and `useNotifications()` gracefully falls back to local storage when network is offline.
- No client-side exposure of secret keys.

---

## 5. Verification Plan

### Automated Tests
- `npx tsc --noEmit` — TypeScript compilation check (0 errors).

### Visual & Manual Tests (via Browser Subagent)
- Open `http://localhost:3000/explore` on wide screen ($\ge 1024\text{px}$) $\rightarrow$ verify full web explore layout with sidebar, search, 3-column core cards, 4-column tool cards, and leaderboard banner.
- Test search filtering: typing "quiz" filters the cards in real time.
- Test card navigation on click $\rightarrow$ navigates to correct routes.
- Open `http://localhost:3000/explore` on mobile ($390\times 844\text{px}$) $\rightarrow$ verify mobile layout and bottom nav work as expected.
