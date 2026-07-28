<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Ticha AI — Agent Guidelines

## App Type: Progressive Web App (PWA)

This is a **Progressive Web App** targeting mobile-first with full web responsiveness. Every page and component MUST work flawlessly on both mobile and desktop.

### PWA Requirements
- All pages must be installable-ready and work offline where possible.
- Use semantic HTML (`<main>`, `<header>`, `<section>`, `<nav>`, `<footer>`) for accessibility and PWA audits.
- Touch targets must be at minimum **44×44px** (WCAG) — buttons, links, and interactive elements.
- Avoid hover-only interactions; always provide `active:` / touch feedback as the primary interaction.
- Use `hover:` states as progressive enhancement for desktop only.
- No horizontal scrolling on any viewport.

---

## Internationalization & Translations (i18n)

Every user-facing string MUST support internationalization using React-i18next:
- **Always translate content**: All text elements (titles, descriptions, labels, button text) must have corresponding English (`en`) and French (`fr`) translation keys inside `src/lib/i18n.ts`.
- **Selected Language Persistence**: Ensure layout, content, hooks, and pages react to and load the user's selected primary language from `localStorage` preference (`ticha_lang`), falling back to `"en"`.
- **Avoid Hydration Mismatch**: Use a client-side mount state indicator (e.g., `isMounted`) before rendering localized content that reads from client storage (`localStorage`) so that SSR and hydration line up perfectly.

---

## Responsive Design Strategy

### Mobile-First (Default)
- **Design for 320px–428px first**. All base styles target mobile.
- Use `max-w-md` (448px) as the standard content container width.
- Use `min-h-screen` or `min-h-[85vh]` for full-viewport layouts on mobile.
- Padding: `px-4` to `px-6` on mobile, scale up at breakpoints.

### Breakpoints (Tailwind v4)
| Prefix | Min-width | Target |
|--------|-----------|--------|
| (none) | 0px | Mobile phones (default) |
| `sm:` | 640px | Large phones / small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops / small desktops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large desktops |

### Responsive Rules
- **Typography**: Scale up at `md:` breakpoint (e.g., `text-2xl md:text-3xl`).
- **Layouts**: Stack vertically on mobile (`flex-col`), go horizontal on `md:`+ (`md:flex-row`).
- **Containers**: `max-w-md` on mobile, `max-w-2xl` on tablets, `max-w-6xl` on desktop.
- **Grids**: 1 column mobile → 2 columns `md:` → 3-4 columns `lg:`.
- **Spacing**: Tighter on mobile (`gap-4`, `p-4`), roomier on desktop (`md:gap-6`, `md:p-8`).
- **Navigation**: Bottom nav or hamburger on mobile, sidebar or top nav on `lg:`.

---

## Design System — Neobrutalism

This project uses a **neobrutalist** design language. Every component MUST follow these visual rules consistently.

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| Background | `#FAF7EC` | Page/app background (warm cream) |
| Foreground | `#1A1A1A` | Primary text |
| Accent Primary | `#B6FF00` | Highlight cards, badges, selection |
| Accent Warm | `#965A18` / `#A05E1B` | Links, icons, gold/warm accents |
| Accent Warm Hover | `#7A4711` | Hovered link state |
| Surface | `white` | Cards, buttons, input backgrounds |
| Muted Text | `text-stone-600` | Secondary/supporting text |
| Muted Dark | `text-stone-800` | Labels, separators |
| Border | `black` | All borders — always solid black |

### Borders & Shadows (Critical)
- **Thick borders**: `border-[3.5px] border-black` on primary cards and buttons.
- **Medium borders**: `border-[2.5px] border-black` on badges and secondary elements.
- **Hard drop shadows**: `shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]` on buttons, `shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]` on feature cards.
- **Small shadows**: `shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]` to `shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]` on badges.
- No `box-shadow` blur — always `0px` spread. Shadows are always solid black offsets.

### Typography
- **Headings**: `font-black uppercase tracking-tight` — bold, loud, confident.
- **Labels/Tags**: `text-xs font-extrabold uppercase tracking-widest`.
- **Body**: `font-medium` at `text-base` or `text-[15px]`.
- **Buttons**: `font-bold text-[17px]`.
- Use system `font-sans` (Geist Sans is loaded in root layout).

### Buttons
- Background: `bg-white` with `border-[3.5px] border-black`.
- Rounded: `rounded-xl`.
- Shadow: `shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]`.
- **Press effect**: `active:translate-x-[2px] active:translate-y-[2px] active:shadow-none` — feels like physically pressing a button.
- Hover (desktop): `hover:bg-stone-50`.
- Always use `transition-transform` for press animation.

### Cards
- Background: accent color (`bg-[#B6FF00]`) or `bg-white`.
- Border: `border-[3.5px] border-black rounded-2xl`.
- Shadow: `shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`.
- Padding: `p-6`.

### Badges / Pills
- `rounded-full` with `border-[2.5px] border-black`.
- `bg-white` with small shadow `shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`.
- Content: `font-bold text-sm` with emoji or icon + text.

### Icons
- Use inline SVGs (no icon libraries) — keep the bundle lean for PWA.
- Size: `w-5 h-5` for buttons, `w-8 h-8` for feature icons.
- Color: `fill-current` with contextual text color, or explicit brand colors.

### Dividers / Separators
- `h-[3px] bg-black` lines with centered label in `text-xs font-black uppercase`.

---

## Form Fields & Inputs — Professional Standards

All form inputs MUST feel polished and production-ready. Never ship raw `<input>` elements without proper UX considerations.

### General Input Rules
- **Focus elevation**: Inputs must visually "lift" on focus — use `focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]` to pop the input upward.
- **Labels**: Always use `<label>` with `text-xs font-extrabold uppercase tracking-widest text-stone-800`.
- **Placeholders**: Use `placeholder-stone-500` — never leave inputs without a placeholder.
- **Full width**: Inputs should always be `w-full` inside their container.
- **Touch-friendly**: Minimum `p-3.5` padding for comfortable mobile input.

### Password Fields (Critical)
Password inputs MUST include these features — never render a plain `type="password"` field:
- **Show/hide toggle**: An eye icon toggle button with `w-11 h-11` (44×44px WCAG touch target) positioned inside the input (`absolute right-3`).
- **Toggle switches between `type="password"` and `type="text"`**.
- **Use the `PasswordInput` component** (`@/components/ui/PasswordInput`) for all password fields.

### Password Strength (Registration/Change Password)
When creating or changing a password, ALWAYS include:
- **Dynamic strength bar** via the `usePasswordStrength` hook (`@/hooks/usePasswordStrength`).
- **Visual indicator**: Rendered by `PasswordStrengthBar` component (`@/components/ui/PasswordStrengthBar`).
- **Individual checks**: Show granular feedback (length, uppercase, lowercase, number, special char).
- **Minimum enforcement**: Block form submission if `strength.score < 3`.

### Confirm Password
When a registration or password-change form has a password field:
- **Always include a confirm password field**.
- **Real-time match indicator**: Show ✓ (green) when passwords match, ✗ (red) when they don't.
- **Block submission** if passwords don't match.

### Error Messages
- Styled as: `bg-[#FF9494] border-[2.5px] border-black rounded-xl p-3 font-bold text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`.
- Prefixed with ⚠️ emoji.
- Clear and actionable — "Please fill in all fields." not "Error 422".

---

## Code Organization — Keep It Clean

Code MUST be refactored into well-organized, modular files. Never dump everything into page files.

### Folder Structure Rules
```
src/
├── app/                    # ONLY route files — page.tsx, layout.tsx, loading.tsx, error.tsx
│                           # NO component definitions, NO utility functions, NO hooks here.
│
├── components/             # All reusable React components
│   ├── ui/                 # Primitive/generic UI components (Button, Input, Modal, etc.)
│   ├── layout/             # Shell components (Header, Footer, Sidebar, etc.)
│   ├── auth/               # Auth-specific components (SocialAuthButtons, etc.)
│   ├── courses/            # Course-domain components (CourseCard, LessonViewer, etc.)
│   └── [feature]/          # Group by feature domain as the app grows
│
├── hooks/                  # All custom React hooks
│                           # One hook per file, named use[Feature].ts
│
├── lib/                    # Non-React utilities, API clients, helpers
│                           # Pure functions, no React imports
│
└── types/                  # TypeScript type definitions and interfaces
                            # Shared domain types, API response types
```

### Refactoring Rules
- **Max ~100 lines per component file**. If a component exceeds this, extract sub-components.
- **Extract repeated patterns**: If the same JSX pattern appears in 2+ pages, create a shared component.
- **One component per file**: Each component gets its own file with a matching name (`PasswordInput.tsx` → `export default function PasswordInput`).
- **Hooks stay in `hooks/`**: Never define `useState`/`useEffect` logic inline in pages when it can be a reusable hook.
- **Page files are thin**: Pages should primarily compose imported components. Logic stays in hooks, UI stays in components.
- **Co-locate by domain**: Group related components under a feature folder (e.g., `components/auth/`, `components/courses/`).
- **Import aliases**: Always use `@/` path aliases (e.g., `@/components/ui/Button`, `@/hooks/useAuth`).

---

## Anti-Patterns — Do NOT
- ❌ Use rounded gradients, glassmorphism, or soft shadows — this is neobrutalism.
- ❌ Use thin `1px` borders — minimum `2.5px`, prefer `3.5px`.
- ❌ Use gray backgrounds — use `#FAF7EC` (cream) or white.
- ❌ Use blur/opacity on shadows — always solid black offsets.
- ❌ Use icon libraries (lucide, heroicons, etc.) — use inline SVGs.
- ❌ Use hover-only interactions — always have `active:` press states.
- ❌ Create desktop-only layouts — always start mobile-first.
- ❌ Use fixed widths that break on small screens.
- ❌ Use raw password inputs without show/hide toggle.
- ❌ Ship registration forms without password strength + confirm password.
- ❌ Dump all code into page files — always refactor into components/hooks.
- ❌ Define reusable components inline inside `app/` route files.
