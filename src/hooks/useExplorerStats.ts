import { useMemo } from "react";
import type { Point, ExplorerStats, ExplorerRank } from "../types";
import { haversineDistance } from "../utils/distance";

const RANK_THRESHOLDS: [number, ExplorerRank][] = [
  [500, "Aether Guide"],
  [200, "Vanguard"],
  [50, "Cartographer"],
  [10, "Pathfinder"],
  [0, "Scout"],
];

const RANK_CAPS = [10, 50, 200, 500, Infinity];
const RANK_BASES = [0, 10, 50, 200, 500];

function computeRank(pointCount: number): {
  rank: ExplorerRank;
  rankProgress: number;
} {
  let rankIndex = 0;
  for (let i = 0; i < RANK_THRESHOLDS.length; i++) {
    if (pointCount >= RANK_THRESHOLDS[i][0]) {
      rankIndex = i;
      break;
    }
    rankIndex = i;
  }
  const rank = RANK_THRESHOLDS[rankIndex][1];
  const tierIndex = RANK_THRESHOLDS.length - 1 - rankIndex;
  const base = RANK_BASES[tierIndex];
  const cap = RANK_CAPS[tierIndex];
  const rankProgress =
    cap === Infinity ? 1 : Math.min((pointCount - base) / (cap - base), 1);
  return { rank, rankProgress };
}

export function useExplorerStats(points: Point[]): ExplorerStats {
  return useMemo(() => {
    let totalDistanceM = 0;
    for (let i = 1; i < points.length; i++) {
      totalDistanceM += haversineDistance(points[i - 1], points[i]);
    }
    const totalDistanceKm = totalDistanceM / 1000;

    const REVEAL_RADIUS_KM = 0.05;
    const areaRevealedKm2 = points.length * Math.PI * REVEAL_RADIUS_KM ** 2;

    const { rank, rankProgress } = computeRank(points.length);

    return { totalDistanceKm, areaRevealedKm2, rank, rankProgress };
  }, [points]);
}
