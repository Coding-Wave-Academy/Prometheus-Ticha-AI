"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth, UserProfile } from "@/hooks/useAuth";
import i18n from "i18next";

export interface ProfileUpdate {
  full_name?: string;
  school_name?: string;
  region?: string;
  education_level?: string;
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

  // Sync from useAuth and set language
  useEffect(() => {
    if (authProfile) {
      setProfile(authProfile);
      setIsLoading(false);
      if (authProfile.preferred_language && typeof window !== "undefined") {
        i18n.changeLanguage(authProfile.preferred_language);
        localStorage.setItem("ticha_lang", authProfile.preferred_language);
      }
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [authProfile, authLoading]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      setProfile(data as UserProfile);
      if (data.preferred_language) {
        i18n.changeLanguage(data.preferred_language);
        localStorage.setItem("ticha_lang", data.preferred_language);
      }
    }
  }, [user]);

  const updateProfile = useCallback(
    async (updates: ProfileUpdate) => {
      if (!user) return { error: "Not authenticated" };

      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

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
      }
      return { error: null };
    },
    [user]
  );

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
