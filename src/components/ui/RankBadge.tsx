import type { ExplorerRank } from "../../types";

const rankStyles: Record<ExplorerRank, string> = {
  Scout: "bg-[#1a2440] text-[#a3aac4]",
  Pathfinder: "bg-[#0d2a20] text-[#c3f400]",
  Cartographer: "bg-[#0d2535] text-[#81ecff]",
  Vanguard: "bg-[#2a1a0d] text-[#ffe792]",
  "Aether Guide": "bg-[#2a0d2a] text-[#e0aaff]",
};

export function RankBadge({ rank }: { rank: ExplorerRank }) {
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${rankStyles[rank]}`}
    >
      {rank}
    </span>
  );
}
