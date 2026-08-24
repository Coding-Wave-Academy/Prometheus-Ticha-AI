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

function compressImage(file: File, maxWidth = 256, maxHeight = 256, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
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
        if (updates.avatar_url) {
          localStorage.setItem("ticha_user_avatar", updates.avatar_url);
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
        if (authProfile.avatar_url) {
          localStorage.setItem("ticha_user_avatar", authProfile.avatar_url);
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
      if (data.avatar_url) {
        localStorage.setItem("ticha_user_avatar", data.avatar_url);
      }
    }
  }, [user]);

  const uploadAvatar = useCallback(
    async (file: File) => {
      if (!user) return { error: "Not authenticated", url: null };

      setIsUploading(true);

      try {
        // 1. Generate optimized compact data URL as immediate resilient fallback
        const base64Url = await compressImage(file);

        const supabase = createClient();
        const fileExt = file.name.split(".").pop() || "jpg";
        const filePath = `${user.id}/avatar.${fileExt}`;

        let finalUrl = base64Url;

        // 2. Try Supabase Storage upload
        try {
          const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: true,
            });

          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from("avatars")
              .getPublicUrl(filePath);
            if (urlData?.publicUrl) {
              finalUrl = `${urlData.publicUrl}?t=${Date.now()}`;
            }
          } else {
            console.warn("Supabase Storage bucket upload skipped or failed, using optimized local data URL:", uploadError.message);
          }
        } catch (storageErr) {
          console.warn("Storage upload exception, using fallback:", storageErr);
        }

        // 3. Update profile with avatar URL (either public storage URL or data URL)
        await updateProfile({ avatar_url: finalUrl });
        if (typeof window !== "undefined") {
          localStorage.setItem("ticha_user_avatar", finalUrl);
        }

        return { error: null, url: finalUrl };
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
