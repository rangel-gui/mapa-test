import { useState, useEffect } from "react";
import type { UserProfile } from "../../types";
import { GlassPanel } from "../ui/GlassPanel";

interface Props {
  isActive: boolean;
  profile: UserProfile;
  onSave: (partial: Partial<UserProfile>) => void;
  onBack: () => void;
}

const AVATAR_SEEDS = ['a3f2c1', 'f1b2e3', '4d8c2a', 'e5a091', '2bc4f7', '9e3d5a', 'c7f014', '0a4b9e'];

function avatarStyle(seed: string): React.CSSProperties {
  const hue = parseInt(seed.slice(0, 2), 16) * (360 / 256);
  return {
    background: `conic-gradient(from 0deg, hsl(${hue},80%,60%), hsl(${hue + 120},80%,50%), hsl(${hue + 240},80%,55%))`,
    borderRadius: '50%',
    width: 80,
    height: 80,
  };
}

const inputClass = "bg-[#141f38] rounded-xl px-4 py-3 text-[#dee5ff] w-full outline-none focus:ring-2 focus:ring-[#81ecff]/40 placeholder:text-[#a3aac4]/60";

export function EditProfileScreen({ isActive, profile, onSave, onBack }: Props) {
  const [form, setForm] = useState({ ...profile });
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setForm({ ...profile });
    setDirty(false);
  }, [profile]);

  const update = (field: keyof UserProfile, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  const cycleAvatar = () => {
    const idx = AVATAR_SEEDS.indexOf(form.avatarSeed);
    update('avatarSeed', AVATAR_SEEDS[(idx + 1) % AVATAR_SEEDS.length]);
  };

  const handleSave = () => {
    onSave(form);
    setDirty(false);
  };

  return (
    <div className={`absolute inset-0 bg-[#060e20] ${!isActive ? 'invisible pointer-events-none' : ''}`}>
      {/* Fixed header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-[#091328]/95 backdrop-blur px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="text-[#a3aac4] text-sm">← Back</button>
        <span className="font-[Space_Grotesk] font-semibold text-[#dee5ff]">Edit Protocol</span>
        <button
          onClick={handleSave}
          disabled={!dirty}
          className={`text-sm font-semibold text-[#81ecff] ${!dirty ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          Save
        </button>
      </div>

      {/* Scrollable body */}
      <div className="pt-[60px] pb-24 overflow-y-auto h-full">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 py-6">
          <div style={avatarStyle(form.avatarSeed)} />
          <button onClick={cycleAvatar} className="text-[#81ecff] text-sm">Change Avatar</button>
        </div>

        {/* Form fields */}
        <div className="px-5 flex flex-col gap-5">
          <div>
            <label className="text-xs text-[#a3aac4] mb-1.5 block">Explorer ID</label>
            <input
              className={inputClass}
              value={form.explorerId}
              onChange={(e) => update('explorerId', e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-[#a3aac4] mb-1.5 block">Display Name</label>
            <input
              className={inputClass}
              value={form.displayName}
              placeholder="Explorer"
              onChange={(e) => update('displayName', e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-[#a3aac4] mb-1.5 block">Specialization</label>
            <input
              className={inputClass}
              value={form.specialization}
              placeholder="Urban Navigator"
              onChange={(e) => update('specialization', e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-[#a3aac4] mb-1.5 block">Bio</label>
            <textarea
              className={inputClass}
              rows={3}
              value={form.bio}
              placeholder="Tell your story..."
              onChange={(e) => update('bio', e.target.value)}
            />
          </div>
        </div>

        {/* Network visibility toggle */}
        <div className="px-5 mt-5 flex items-center justify-between">
          <div>
            <div className="text-sm text-[#dee5ff]">Network Visibility</div>
            <div className="text-xs text-[#a3aac4]">Show on community map</div>
          </div>
          <button
            onClick={() => update('networkVisible', !form.networkVisible)}
            className={`w-12 h-6 rounded-full transition-colors relative ${form.networkVisible ? 'bg-[#81ecff]' : 'bg-[#40485d]'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.networkVisible ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {/* Sync status */}
        <div className="px-5 mt-5">
          <GlassPanel>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${profile.lastSyncedAt ? 'bg-green-400' : 'bg-amber-400 animate-pulse'}`} />
              <span className="text-sm text-[#a3aac4]">
                Last Synced: {profile.lastSyncedAt ? new Date(profile.lastSyncedAt).toLocaleDateString() : 'Never'}
              </span>
            </div>
          </GlassPanel>
        </div>

        {/* Full-width save button */}
        <div className="px-5 mt-5">
          <button
            onClick={handleSave}
            disabled={!dirty}
            className={`w-full bg-[#81ecff] text-[#005762] font-bold py-3.5 rounded-xl ${!dirty ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
