import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, useColorScheme, View } from "react-native";
import type { Href } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider, Slot, useRouter, useSegments, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { SkinProfileProvider, useSkinProfile } from "@/contexts/skin-profile-context";
import { colors } from "@/theme/colors";

SplashScreen.preventAutoHideAsync();

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === "(auth)";
    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (session && inAuthGroup) {
      router.replace("/");
    }
  }, [session, loading, segments, router]);

  return null;
}

function ProfileGate() {
  const router = useRouter();
  const pathname = usePathname();
  const { session, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useSkinProfile();

  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (!session) return;

    const inProfileSetup =
      pathname === "/profile-setup" ||
      pathname === "/(authenticated)/profile-setup";

    if (!profile && !inProfileSetup) {
      router.replace("/(authenticated)/profile-setup" as Href);
    }
  }, [session, authLoading, profileLoading, profile, pathname, router]);

  return null;
}

function RootLayoutInner() {
  const { loading } = useAuth();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthGate />
      <ProfileGate />
      <Slot />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SkinProfileProvider>
        <RootLayoutInner />
      </SkinProfileProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});
