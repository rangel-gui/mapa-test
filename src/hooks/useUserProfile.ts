import { useState, useCallback } from "react";
import type { UserProfile } from "../types";

const STORAGE_KEY = "fog-user-profile";

function generateDefault(): UserProfile {
  const rand = Math.random().toString(36).slice(2, 6);
  return {
    explorerId: `explorer_${rand}`,
    displayName: "Explorer",
    specialization: "Urban Navigator",
    bio: "",
    avatarSeed: Math.random().toString(36).slice(2, 8),
    networkVisible: true,
    createdAt: Date.now(),
    lastSyncedAt: null,
  };
}

function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return generateDefault();
    return JSON.parse(raw) as UserProfile;
  } catch {
    return generateDefault();
  }
}

function saveProfile(p: UserProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(loadProfile);

  const updateProfile = useCallback((partial: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...partial };
      saveProfile(next);
      return next;
    });
  }, []);

  const resetProfile = useCallback(() => {
    const fresh = generateDefault();
    saveProfile(fresh);
    setProfile(fresh);
  }, []);

  return { profile, updateProfile, resetProfile };
}
