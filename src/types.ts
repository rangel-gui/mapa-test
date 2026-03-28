export interface Point { lat: number; lng: number; }

// --- Navigation ---
export type Screen = 'map' | 'log' | 'community' | 'profile' | 'edit-profile';

// --- User Profile ---
export type ExplorerRank =
  | 'Scout'        // 0–9 points
  | 'Pathfinder'   // 10–49 points
  | 'Cartographer' // 50–199 points
  | 'Vanguard'     // 200–499 points
  | 'Aether Guide'; // 500+ points

export interface UserProfile {
  explorerId: string;        // auto-generated "explorer_xxxx"
  displayName: string;
  specialization: string;    // e.g. "Urban Navigator"
  bio: string;
  avatarSeed: string;        // 6-char hex → drives CSS conic-gradient avatar
  networkVisible: boolean;
  createdAt: number;         // Date.now()
  lastSyncedAt: number | null;
}

// --- Computed Stats ---
export interface ExplorerStats {
  totalDistanceKm: number;   // sum of haversine(consecutive points) / 1000
  areaRevealedKm2: number;   // points.length * π * 0.05² (approx, 50m radius)
  rank: ExplorerRank;
  rankProgress: number;      // 0–1, progress within current rank tier
}

// --- Achievements ---
export type AchievementId =
  | 'first_descent'   // points.length >= 1
  | 'lead_scout'      // points.length >= 100
  | 'fog_breaker'     // areaRevealedKm2 >= 1.0
  | 'trail_blazer'    // totalDistanceKm >= 10
  | 'midnight_rover'; // always locked in MVP (requires time-of-day tracking)

export interface Achievement {
  id: AchievementId;
  label: string;
  description: string;
  unlockedAt: number | null; // null = locked
}
