interface Props {
  isActive: boolean;
}

const LEADERS = [
  { rank: 1, name: 'ShadowCartographer', km: 142.8 },
  { rank: 2, name: 'NeonPathfinder_X',   km: 98.3  },
  { rank: 3, name: 'VoidWalker91',       km: 76.1  },
  { rank: 4, name: 'AetherScout',        km: 61.5  },
  { rank: 5, name: 'FogBreakerZ',        km: 44.9  },
];

function nameToHue(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  return Math.abs(hash) % 360;
}

function avatarStyle(name: string): React.CSSProperties {
  const hue = nameToHue(name);
  return {
    background: `conic-gradient(from 0deg, hsl(${hue},80%,60%), hsl(${hue + 120},80%,50%), hsl(${hue + 240},80%,55%))`,
    borderRadius: '50%',
    width: 32,
    height: 32,
    flexShrink: 0,
  };
}

export function CommunityScreen({ isActive }: Props) {
  return (
    <div className={`absolute inset-0 overflow-y-auto bg-[#060e20] pb-20 ${!isActive ? 'invisible pointer-events-none' : ''}`}>
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <div className="font-[Space_Grotesk] text-[22px] font-semibold text-[#dee5ff]">Community Expeditions</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs text-[#a3aac4]">Network scan unavailable</span>
        </div>
      </div>

      {/* Active Expeditions */}
      <div className="mx-4 mt-4 bg-[#141f38]/60 backdrop-blur-sm rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-[#dee5ff] font-[Space_Grotesk]">Active Expeditions</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400">OFFLINE</span>
        </div>
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl shimmer" />
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="mx-4 mt-3 bg-[#141f38]/60 backdrop-blur-sm rounded-2xl p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-[#dee5ff] font-[Space_Grotesk]">Leaderboard</span>
          <span className="text-xs text-[#a3aac4]">Weekly Ranking</span>
        </div>
        <div className="flex flex-col">
          {LEADERS.map((l) => (
            <div
              key={l.rank}
              className={`flex items-center gap-3 py-3 ${l.rank === 1 ? 'bg-[#81ecff]/5 rounded-xl px-2' : ''}`}
            >
              <span className={`w-5 text-sm font-bold text-center ${l.rank === 1 ? 'text-[#81ecff]' : 'text-[#a3aac4]'}`}>
                {l.rank}
              </span>
              <div style={avatarStyle(l.name)} />
              <span className="flex-1 text-sm text-[#dee5ff] truncate">{l.name}</span>
              <span className="text-sm font-semibold text-[#a3aac4]">{l.km} km</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sync to Join */}
      <div className="mx-4 mt-3 bg-[#141f38]/60 backdrop-blur-sm rounded-2xl p-4">
        <div className="font-[Space_Grotesk] font-semibold text-[#dee5ff] mb-1">Join an Expedition</div>
        <p className="text-sm text-[#a3aac4] mb-4">
          Sync your device to discover and join active community expeditions.
        </p>
        <button
          disabled
          className="w-full border border-[#81ecff]/40 text-[#81ecff] py-3 rounded-xl text-sm font-semibold opacity-50 cursor-not-allowed"
        >
          Sync Required
        </button>
        <div className="flex justify-center mt-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400">OFFLINE</span>
        </div>
      </div>
    </div>
  );
}
