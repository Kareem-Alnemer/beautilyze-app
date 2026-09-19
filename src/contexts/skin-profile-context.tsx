import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth-context";
import type { SkinProfile } from "@/types/supabase";

interface SkinProfileContextValue {
  profile: SkinProfile | null;
  loading: boolean;
  error: string | null;
  saveProfile: (
    data: Omit<SkinProfile, "id" | "user_id" | "updated_at">,
  ) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const SkinProfileContext = createContext<SkinProfileContextValue | null>(null);

interface SkinProfileProviderProps {
  children: ReactNode;
}

export function SkinProfileProvider({ children }: SkinProfileProviderProps) {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<SkinProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      // Intentional state reset on external auth change.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfile(null);
      setLoading(false);
      setError(null);
      setLoadedUserId(null);
      return;
    }

    if (loadedUserId === user.id) return;

    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("skin_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
        setProfile(null);
      } else {
        setProfile(data);
      }

      setLoading(false);
      setLoadedUserId(user!.id);
    }

    fetch();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading, loadedUserId]);

  const saveProfile = useCallback(
    async (
      data: Omit<SkinProfile, "id" | "user_id" | "updated_at">,
    ): Promise<{ error: string | null }> => {
      if (!user) {
        return { error: "Not signed in" };
      }

      const { error: upsertError } = await supabase
        .from("skin_profiles")
        .upsert(
          { ...data, user_id: user.id },
          { onConflict: "user_id" },
        );

      if (upsertError) {
        return { error: upsertError.message };
      }

      const { data: refreshed } = await supabase
        .from("skin_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      setProfile(refreshed);
      return { error: null };
    },
    [user],
  );

  const refreshProfile = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("skin_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchError) {
      setError(fetchError.message);
      setProfile(null);
    } else {
      setProfile(data);
    }
    setLoading(false);
  }, [user]);

  return (
    <SkinProfileContext.Provider
      value={{ profile, loading, error, saveProfile, refreshProfile }}
    >
      {children}
    </SkinProfileContext.Provider>
  );
}

export function useSkinProfile(): SkinProfileContextValue {
  const ctx = useContext(SkinProfileContext);
  if (!ctx) {
    throw new Error("useSkinProfile must be used within a SkinProfileProvider");
  }
  return ctx;
}
