type Accent = 'cyan' | 'lime' | 'gold' | 'default';
interface Props { label: string; value: string; accent?: Accent; icon?: React.ReactNode; }

const accentColors: Record<Accent, string> = {
  cyan:    'text-[#81ecff]',
  lime:    'text-[#c3f400]',
  gold:    'text-[#ffe792]',
  default: 'text-[#dee5ff]',
};

export function StatCard({ label, value, accent = 'default', icon }: Props) {
  return (
    <div className="bg-[#141f38]/60 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-1">
      {icon && <div className="text-[#a3aac4] mb-1">{icon}</div>}
      <span className={`text-2xl font-bold font-[Space_Grotesk] ${accentColors[accent]}`}>{value}</span>
      <span className="text-xs text-[#a3aac4] font-[Manrope]">{label}</span>
    </div>
  );
}
