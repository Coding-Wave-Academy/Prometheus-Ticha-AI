// Leaderboard-specific types
export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  school: string;
  isSelf?: boolean;
}

export interface PodiumUser {
  rank: 1 | 2 | 3;
  name: string;
  points: number;
  avatar: string;
}

export type EducationLevel = "secondary" | "tertiary";
export type FilterContext = "national" | "community" | "school";
