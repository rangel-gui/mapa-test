interface Props { children: React.ReactNode; className?: string; }

export function GlassPanel({ children, className = '' }: Props) {
  return (
    <div className={`bg-[#141f38]/60 backdrop-blur-sm rounded-2xl p-4 ${className}`}>
      {children}
    </div>
  );
}
