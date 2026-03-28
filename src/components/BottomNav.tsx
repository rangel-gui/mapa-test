import type { Screen } from "../types";

interface Props {
  screen: Screen;
  onNavigate: (s: Screen) => void;
}

const MapIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    className="w-6 h-6"
  >
    <polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21" />
    <line x1="9" y1="3" x2="9" y2="18" />
    <line x1="15" y1="6" x2="15" y2="21" />
  </svg>
);

const BookIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    className="w-6 h-6"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    className="w-6 h-6"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const UserIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    className="w-6 h-6"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const TABS = [
  { id: "map", label: "Map", icon: MapIcon },
  { id: "log", label: "Log", icon: BookIcon },
  { id: "community", label: "Community", icon: UsersIcon },
  { id: "profile", label: "Profile", icon: UserIcon },
] as const;

export function BottomNav({ screen, onNavigate }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 h-16 z-[3000] bg-[#091328]/90 backdrop-blur-md"
      style={{
        boxShadow: "0 -1px 0 rgba(255,255,255,0.05)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="grid grid-cols-4 h-full">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = screen === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id as Screen)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${active ? "text-[#81ecff]" : "text-[#a3aac4]"}`}
            >
              <Icon />
              <span className="text-[10px] font-[Manrope] font-medium">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
