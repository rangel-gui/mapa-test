import type { Achievement } from "../../types";

export function AchievementBadge({
  achievement,
}: {
  achievement: Achievement;
}) {
  const unlocked = achievement.unlockedAt !== null;
  return (
    <div
      className={`flex flex-col items-center gap-1 p-3 rounded-xl bg-[#141f38] ${!unlocked ? "opacity-40 grayscale" : ""}`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${unlocked ? "bg-[#81ecff]/10 shadow-[0_0_12px_#81ecff40]" : "bg-[#1a2440]"}`}
      >
        🏅
      </div>
      <span className="text-[10px] font-semibold text-center text-[#dee5ff] leading-tight">
        {achievement.label}
      </span>
    </div>
  );
}
