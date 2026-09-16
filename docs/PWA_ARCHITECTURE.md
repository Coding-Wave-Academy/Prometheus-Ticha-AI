# Ticha AI — PWA & Offline-First Architecture

## 1. Overview

**Ticha AI** is engineered as an offline-first Progressive Web Application (PWA). Target users in Cameroon often experience intermittent, high-latency, or metered mobile data connections. The app must deliver an uninterrupted study experience regardless of network status.

---

## 2. Core PWA Technologies

- **Service Worker Engine**: Built using Workbox via `@ducanh2912/next-pwa`.
- **Manifest**: Located at `/manifest.json` with high-resolution icons (192x192, 512x512) and standalone display configuration.
- **Client Cache Layers**:
  1. **CacheStorage**: Stores static application shells, fonts (Baloo 2, Plus Jakarta Sans), SVGs, and brand assets.
  2. **LocalStorage & IndexedDB**: Caches student onboarding preferences (education level, struggle subjects, streak counts) and downloaded past papers.

---

## 3. Caching Strategies

- **Static Assets (Stale-While-Revalidate)**: CSS bundles, icons, and UI assets are served from cache immediately while fetching background updates.
- **Syllabus & Questions (Cache-First with Network Fallback)**: Cameroon GCE subject taxonomies and question banks are pre-cached for offline access.
- **Interactive AI Endpoints (Network-First with Offline Graceful Degradation)**:
  - If network is online: Real-time tutoring response.
  - If network is offline: Displays an offline banner with saved notes, flashcards, and downloaded past paper questions.

---

## 4. Mobile Viewport & Touch Optimization

- **CSS Boundary Control**: `html` and `body` enforce `max-width: 100vw` and `overflow-x: hidden` to prevent unintended horizontal drift.
- **Touch Gestures**: `touch-action: manipulation` prevents mobile double-tap zoom delay. Critical interactive components (like the Commitment Fingerprint hold) use dedicated Pointer Events with pointer capture to prevent scroll interference.
- **Neobrutalist Tactile Feedback**: Micro-interactions utilize `navigator.vibrate` haptic pulses and CSS spring physics (`active-press`) to provide native app responsiveness.
