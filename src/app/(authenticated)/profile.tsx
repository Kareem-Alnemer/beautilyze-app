import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/auth-context";
import { useSkinProfile } from "@/contexts/skin-profile-context";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

function label(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { profile } = useSkinProfile();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Email</Text>
        <Text style={styles.cardValue}>{user?.email ?? "Not signed in"}</Text>
      </View>

      {profile ? (
        <>
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Skin Type</Text>
            <Text style={styles.fieldValue}>{label(profile.skin_type)}</Text>

            <Text style={styles.fieldLabel}>Concerns</Text>
            <View style={styles.chipRow}>
              {profile.concerns.map((c) => (
                <View key={c} style={styles.chip}>
                  <Text style={styles.chipText}>{label(c)}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Allergies</Text>
            <View style={styles.chipRow}>
              {profile.allergies.length > 0 ? (
                profile.allergies.map((a) => (
                  <View key={a} style={styles.chip}>
                    <Text style={styles.chipText}>{a}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.fieldValue}>None</Text>
              )}
            </View>

            <Text style={styles.fieldLabel}>Age Group</Text>
            <Text style={styles.fieldValue}>{profile.age_group}</Text>

            <Text style={styles.fieldLabel}>Sensitivity Level</Text>
            <Text style={styles.fieldValue}>{label(profile.sensitivity_level)}</Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.editButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/(authenticated)/profile-setup")}
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.card}>
          <Text style={styles.fieldValue}>
            You haven&apos;t completed your skin profile yet.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.editButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/(authenticated)/profile-setup")}
            accessibilityRole="button"
            accessibilityLabel="Complete profile"
          >
            <Text style={styles.editButtonText}>Complete Profile</Text>
          </Pressable>
        </View>
      )}

      <Pressable
        style={({ pressed }) => [
          styles.signOutButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleSignOut}
        accessibilityRole="button"
        accessibilityLabel="Sign out"
      >
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.xl,
  },
  cardLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  cardValue: {
    ...typography.body,
    color: colors.text,
  },
  fieldLabel: {
    ...typography.bodySmall,
    fontWeight: "600",
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  fieldValue: {
    ...typography.body,
    color: colors.text,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  chipText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  editButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.input,
    paddingVertical: spacing.md,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  editButtonText: {
    ...typography.body,
    fontWeight: "600",
    color: colors.surface,
  },
  signOutButton: {
    backgroundColor: colors.danger,
    borderRadius: radii.input,
    paddingVertical: spacing.md,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  signOutButtonText: {
    ...typography.body,
    fontWeight: "600",
    color: colors.surface,
  },
  buttonPressed: {
    opacity: 0.8,
  },
});
