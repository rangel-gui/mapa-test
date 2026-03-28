import type { UserProfile, ExplorerStats, Point, Achievement } from "../../types";
import { RankBadge } from "../ui/RankBadge";
import { StatCard } from "../ui/StatCard";
import { GlassPanel } from "../ui/GlassPanel";
import { AchievementBadge } from "../ui/AchievementBadge";

interface Props {
  isActive: boolean;
  profile: UserProfile;
  stats: ExplorerStats;
  points: Point[];
  onEditProfile: () => void;
}

function avatarStyle(seed: string): React.CSSProperties {
  const hue = parseInt(seed.slice(0, 2), 16) * (360 / 256);
  return {
    background: `conic-gradient(from 0deg, hsl(${hue},80%,60%), hsl(${hue + 120},80%,50%), hsl(${hue + 240},80%,55%))`,
    borderRadius: '50%',
  };
}

const ACHIEVEMENTS_DEF = [
  { id: 'first_descent',  label: 'First Descent',  description: 'Log your first point' },
  { id: 'lead_scout',     label: 'Lead Scout',      description: '100 points logged' },
  { id: 'fog_breaker',    label: 'Fog Breaker',     description: '1 km² of fog cleared' },
  { id: 'trail_blazer',   label: 'Trail Blazer',    description: '10 km total distance' },
  { id: 'midnight_rover', label: 'Midnight Rover',  description: 'Explore between 00–05h' },
] as const;

export function ProfileScreen({ isActive, profile, stats, points, onEditProfile }: Props) {
  const achievements: Achievement[] = ACHIEVEMENTS_DEF.map((a) => ({
    ...a,
    unlockedAt: (() => {
      if (a.id === 'first_descent')  return points.length >= 1              ? Date.now() : null;
      if (a.id === 'lead_scout')     return points.length >= 100            ? Date.now() : null;
      if (a.id === 'fog_breaker')    return stats.areaRevealedKm2 >= 1.0   ? Date.now() : null;
      if (a.id === 'trail_blazer')   return stats.totalDistanceKm >= 10    ? Date.now() : null;
      return null;
    })(),
  }));

  const seed = parseInt(profile.avatarSeed.slice(0, 4), 36);
  const heatmapCells = Array.from({ length: 28 }, (_, i) => ((seed * (i + 1) * 31) % 100) / 100);

  return (
    <div className={`absolute inset-0 overflow-y-auto bg-[#060e20] pb-20 ${!isActive ? 'invisible pointer-events-none' : ''}`}>
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-4 relative">
        <div style={{ ...avatarStyle(profile.avatarSeed), width: 80, height: 80, flexShrink: 0 }} />
        <div className="flex-1 min-w-0">
          <div className="font-[Space_Grotesk] text-[22px] font-semibold text-[#dee5ff] truncate">{profile.displayName}</div>
          <div className="font-mono text-xs text-[#a3aac4] mt-0.5">{profile.explorerId}</div>
          <div className="mt-1.5"><RankBadge rank={stats.rank} /></div>
        </div>
        <button
          onClick={onEditProfile}
          className="absolute top-6 right-5 text-xs text-[#81ecff] font-medium"
        >
          Edit Protocol
        </button>
      </div>

      {/* Stats grid */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <StatCard label="Distance" value={`${stats.totalDistanceKm.toFixed(2)} km`} accent="cyan" />
        <StatCard label="Area Revealed" value={`${stats.areaRevealedKm2.toFixed(3)} km²`} accent="lime" />
        <StatCard label="Artifacts" value="0" accent="gold" />
        <StatCard label="Points Logged" value={String(points.length)} />
      </div>

      {/* Activity Heatmap */}
      <div className="px-4 mt-4">
        <GlassPanel>
          <div className="text-xs font-semibold text-[#a3aac4] mb-3 font-[Space_Grotesk]">Exploration Activity</div>
          <div className="grid grid-cols-7 gap-1">
            {heatmapCells.map((intensity, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-sm bg-[#81ecff]"
                style={{ opacity: 0.1 + intensity * 0.9 }}
              />
            ))}
          </div>
        </GlassPanel>
      </div>

      {/* Achievements */}
      <div className="px-4 mt-4">
        <div className="text-sm font-semibold text-[#dee5ff] font-[Space_Grotesk] mb-3">Achievements</div>
        <div className="flex flex-wrap gap-3">
          {achievements.map((a) => (
            <AchievementBadge key={a.id} achievement={a} />
          ))}
        </div>
      </div>
    </div>
  );
}
