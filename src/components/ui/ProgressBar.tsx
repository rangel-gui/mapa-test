interface Props { value: number; max: number; color?: string; className?: string; }

export function ProgressBar({ value, max, color = '#c3f400', className = '' }: Props) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className={`h-2 rounded-full bg-[#141f38] overflow-hidden ${className}`}>
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}
