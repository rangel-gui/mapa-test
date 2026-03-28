import { useState } from "react";
import type { UserProfile, ExplorerStats } from "../../types";
import { RankBadge } from "../ui/RankBadge";
import { GlassPanel } from "../ui/GlassPanel";
import { ProgressBar } from "../ui/ProgressBar";

interface Props {
  isActive: boolean;
  profile: UserProfile;
  stats: ExplorerStats;
}

type Rarity = 'Common' | 'Rare' | 'Legendary';

const ARTIFACTS = [
  { id: '1', name: 'Sunken Chronometer',  rarity: 'Legendary' as Rarity, xp: 500, location: 'Harbor District',     time: '2h ago' },
  { id: '2', name: "Outlaw's Compass",    rarity: 'Rare'      as Rarity, xp: 150, location: 'Market Square',       time: '1d ago' },
  { id: '3', name: 'Rusty Iron Key',      rarity: 'Common'    as Rarity, xp: 25,  location: 'Old Quarter',         time: '3d ago' },
  { id: '4', name: 'Glow-stone Shard',    rarity: 'Common'    as Rarity, xp: 25,  location: 'Northern Trail',      time: '5d ago' },
  { id: '5', name: 'Aether Crystal',      rarity: 'Rare'      as Rarity, xp: 200, location: 'Hilltop Observatory', time: '1w ago' },
];

const LANDMARKS = [
  { id: '1', name: 'Ancient Watchtower', xp: 300 },
  { id: '2', name: 'Forgotten Shrine',   xp: 200 },
];

const rarityConfig = {
  Legendary: { strip: 'bg-[#ffe792]', text: 'text-[#ffe792]', label: 'LEGENDARY' },
  Rare:      { strip: 'bg-[#81ecff]', text: 'text-[#81ecff]', label: 'RARE' },
  Common:    { strip: 'bg-[#a3aac4]', text: 'text-[#a3aac4]', label: 'COMMON' },
};

function avatarStyle(seed: string): React.CSSProperties {
  const hue = parseInt(seed.slice(0, 2), 16) * (360 / 256);
  return {
    background: `conic-gradient(from 0deg, hsl(${hue},80%,60%), hsl(${hue + 120},80%,50%), hsl(${hue + 240},80%,55%))`,
    borderRadius: '50%',
    width: 32,
    height: 32,
    flexShrink: 0,
  };
}

export function DiscoveryLogScreen({ isActive, profile, stats }: Props) {
  const [filter, setFilter] = useState<'all' | 'rare' | 'legendary'>('all');

  const filtered = ARTIFACTS.filter((a) => {
    if (filter === 'legendary') return a.rarity === 'Legendary';
    if (filter === 'rare')      return a.rarity === 'Legendary' || a.rarity === 'Rare';
    return true;
  });

  const weeklyKm = stats.totalDistanceKm % 10;
  const weeklyTarget = 10;

  return (
    <div className={`absolute inset-0 overflow-y-auto bg-[#060e20] pb-20 ${!isActive ? 'invisible pointer-events-none' : ''}`}>
      <div className="px-4 pt-6 pb-20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div style={avatarStyle(profile.avatarSeed)} />
          <div>
            <div className="text-sm font-semibold text-[#dee5ff]">{profile.displayName}</div>
          </div>
          <div className="ml-1"><RankBadge rank={stats.rank} /></div>
        </div>

        {/* Artifacts */}
        <div className="mb-5">
          <div className="text-sm font-semibold text-[#dee5ff] font-[Space_Grotesk] mb-3">Artifacts</div>

          {/* Filter pills */}
          <div className="flex gap-2 mb-3">
            {(['all', 'rare', 'legendary'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                  filter === f
                    ? 'bg-[#81ecff] text-[#005762]'
                    : 'bg-[#141f38] text-[#a3aac4]'
                }`}
              >
                {f === 'all' ? 'All' : f === 'rare' ? 'Rare+' : 'Legendary'}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {filtered.map((a) => (
              <div key={a.id} className="flex bg-[#141f38]/60 rounded-xl overflow-hidden">
                <div className={`w-1 flex-shrink-0 ${rarityConfig[a.rarity].strip}`} />
                <div className="flex-1 px-4 py-3">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-[#dee5ff] text-sm">{a.name}</span>
                    <span className={`text-xs font-bold ${rarityConfig[a.rarity].text}`}>{rarityConfig[a.rarity].label}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-[#a3aac4]">📍 {a.location}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#c3f400]">+{a.xp} XP</span>
                      <span className="text-xs text-[#a3aac4]">{a.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Landmarks */}
        <div className="mb-5">
          <div className="text-sm font-semibold text-[#dee5ff] font-[Space_Grotesk] mb-3">Recent Landmarks</div>
          <div className="flex flex-col gap-2">
            {LANDMARKS.map((l) => (
              <GlassPanel key={l.id} className="flex items-center justify-between">
                <span className="text-sm text-[#dee5ff]">{l.name}</span>
                <span className="text-xs font-bold text-[#c3f400]">+{l.xp} XP</span>
              </GlassPanel>
            ))}
          </div>
        </div>

        {/* Weekly Goal */}
        <GlassPanel>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-[#dee5ff] font-[Space_Grotesk]">Weekly Goal</span>
            <span className="text-sm text-[#c3f400] font-bold">{weeklyKm.toFixed(1)} / {weeklyTarget} km</span>
          </div>
          <ProgressBar value={weeklyKm} max={weeklyTarget} color="#c3f400" />
          <div className="text-xs text-[#a3aac4] mt-2">Complete {weeklyTarget} km to unlock a weekly reward</div>
        </GlassPanel>
      </div>
    </div>
  );
}
