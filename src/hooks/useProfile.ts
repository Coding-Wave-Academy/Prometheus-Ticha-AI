"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth, UserProfile } from "@/hooks/useAuth";
import i18n from "i18next";

export interface ProfileUpdate {
  full_name?: string;
  school_name?: string;
  region?: string;
  education_level?: string;
  goal?: string;
  struggles?: string[];
  profile_completed?: boolean;
  streak_count?: number;
  freezes_remaining?: number;
  last_active_date?: string;
  avatar_url?: string;
  preferred_language?: string;
}

export function useProfile() {
  const { user, profile: authProfile, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const hasSyncedRef = useRef(false);

  const updateProfile = useCallback(
    async (updates: ProfileUpdate) => {
      if (!user) return { error: "Not authenticated" };

      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            ...updates,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        )
        .select()
        .maybeSingle();

      if (error) {
        console.error("Error updating profile:", error);
        return { error: error.message };
      }

      if (data) {
        setProfile(data as UserProfile);
        if (updates.preferred_language) {
          i18n.changeLanguage(updates.preferred_language);
          localStorage.setItem("ticha_lang", updates.preferred_language);
        }
        if (updates.struggles && Array.isArray(updates.struggles)) {
          localStorage.setItem("ticha_onboarding_struggles", JSON.stringify(updates.struggles));
        }
        if (updates.goal) {
          localStorage.setItem("ticha_onboarding_goal", updates.goal);
        }
        if (updates.education_level) {
          localStorage.setItem("ticha_onboarding_education", updates.education_level);
        }
      }
      return { error: null };
    },
    [user]
  );

  // Sync from useAuth and handle bidirectional synchronization with localStorage
  useEffect(() => {
    if (authProfile) {
      setProfile(authProfile);
      setIsLoading(false);

      if (typeof window !== "undefined") {
        if (authProfile.preferred_language) {
          i18n.changeLanguage(authProfile.preferred_language);
          localStorage.setItem("ticha_lang", authProfile.preferred_language);
        }

        // 1. If database profile has struggles / goal / education, sync to localStorage
        const hasDbStruggles = Array.isArray(authProfile.struggles) && authProfile.struggles.length > 0;
        if (hasDbStruggles) {
          localStorage.setItem("ticha_onboarding_struggles", JSON.stringify(authProfile.struggles));
        }
        if (authProfile.goal) {
          localStorage.setItem("ticha_onboarding_goal", authProfile.goal);
        }
        if (authProfile.education_level) {
          localStorage.setItem("ticha_onboarding_education", authProfile.education_level);
        }

        // 2. If database is missing goals/struggles but localStorage has onboarding data, push to DB!
        if (!hasSyncedRef.current && user) {
          const pendingUpdates: ProfileUpdate = {};
          let shouldUpdate = false;

          if (!hasDbStruggles) {
            const localStruggles = localStorage.getItem("ticha_onboarding_struggles");
            if (localStruggles) {
              try {
                const parsed = JSON.parse(localStruggles);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  pendingUpdates.struggles = parsed;
                  shouldUpdate = true;
                }
              } catch { /* ignore */ }
            }
          }

          if (!authProfile.goal) {
            const localGoal = localStorage.getItem("ticha_onboarding_goal");
            if (localGoal) {
              pendingUpdates.goal = localGoal;
              shouldUpdate = true;
            }
          }

          if (!authProfile.education_level) {
            const localEdu = localStorage.getItem("ticha_onboarding_education");
            if (localEdu) {
              pendingUpdates.education_level = localEdu;
              shouldUpdate = true;
            }
          }

          if (shouldUpdate) {
            hasSyncedRef.current = true;
            updateProfile(pendingUpdates).catch((err) =>
              console.warn("Background profile sync warning:", err)
            );
          }
        }
      }
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [authProfile, authLoading, user, updateProfile]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (!error && data) {
      setProfile(data as UserProfile);
      if (data.preferred_language) {
        i18n.changeLanguage(data.preferred_language);
        localStorage.setItem("ticha_lang", data.preferred_language);
      }
      if (Array.isArray(data.struggles) && data.struggles.length > 0) {
        localStorage.setItem("ticha_onboarding_struggles", JSON.stringify(data.struggles));
      }
      if (data.goal) {
        localStorage.setItem("ticha_onboarding_goal", data.goal);
      }
      if (data.education_level) {
        localStorage.setItem("ticha_onboarding_education", data.education_level);
      }
    }
  }, [user]);

  const uploadAvatar = useCallback(
    async (file: File) => {
      if (!user) return { error: "Not authenticated", url: null };

      setIsUploading(true);

      try {
        const supabase = createClient();
        const fileExt = file.name.split(".").pop();
        const filePath = `${user.id}/avatar.${fileExt}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          console.error("Error uploading avatar:", uploadError);
          return { error: uploadError.message, url: null };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

        // Update profile with new avatar URL
        await updateProfile({ avatar_url: avatarUrl });

        return { error: null, url: avatarUrl };
      } catch (err) {
        console.error("Avatar upload exception:", err);
        return { error: "Upload failed", url: null };
      } finally {
        setIsUploading(false);
      }
    },
    [user, updateProfile]
  );

  return {
    profile,
    isLoading,
    isUploading,
    updateProfile,
    uploadAvatar,
    refreshProfile,
  };
}
