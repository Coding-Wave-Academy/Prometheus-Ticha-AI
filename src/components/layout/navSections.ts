/**
 * Which sidebar section a route belongs to. Longest matching prefix wins, so
 * nested study pages highlight the hub they are reached from.
 */
export type NavSectionId =
  | "dashboard"
  | "explore"
  | "tutor"
  | "videos"
  | "papers"
  | "progress"
  | "settings";

const ROUTE_SECTIONS: ReadonlyArray<readonly [prefix: string, section: NavSectionId]> = [
  ["/dashboard/daily-lessons", "dashboard"],
  ["/dashboard/notifications", "dashboard"],
  ["/dashboard/daily-quiz", "explore"],
  ["/dashboard/quiz-generator", "explore"],
  ["/dashboard/flashcards", "explore"],
  ["/dashboard/subjects", "explore"],
  ["/dashboard/tutor", "tutor"],
  ["/dashboard/videos", "videos"],
  ["/dashboard/progress", "progress"],
  ["/dashboard/profile", "settings"],
  ["/dashboard", "dashboard"],
  ["/explore", "explore"],
  ["/summaries", "explore"],
  ["/practice", "explore"],
  ["/leaderboard", "explore"],
  ["/courses", "explore"],
  ["/daily-quiz", "explore"],
  ["/past-papers", "papers"],
];

export function sectionForPath(pathname: string): NavSectionId | null {
  const path = pathname.replace(/\/+$/, "") || "/";
  let best: { len: number; section: NavSectionId } | null = null;
  for (const [prefix, section] of ROUTE_SECTIONS) {
    const matches = path === prefix || path.startsWith(prefix + "/");
    if (matches && (!best || prefix.length > best.len)) best = { len: prefix.length, section };
  }
  return best?.section ?? null;
}
