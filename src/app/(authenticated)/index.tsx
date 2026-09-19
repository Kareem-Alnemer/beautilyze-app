import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/auth-context";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hello, {user?.email?.split("@")[0] ?? "there"}
          </Text>
          <Text style={styles.title}>Welcome to BeautiLyze</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="scan-outline" size={48} color={colors.primary} />
          <Text style={styles.cardTitle}>Scan a Product</Text>
          <Text style={styles.cardHint}>
            Point your camera at an ingredient label to get a personalized analysis.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {}}
            accessibilityRole="button"
            accessibilityLabel="Scan product"
          >
            <Text style={styles.buttonText}>Scan Product</Text>
          </Pressable>
        </View>

        <Text style={styles.footerHint}>
          Scan a product to get started with your first analysis.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    gap: spacing.xl,
  },
  header: {
    gap: spacing.xs,
  },
  greeting: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.md,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
  },
  cardHint: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.input,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
    marginTop: spacing.sm,
    alignSelf: "stretch",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    ...typography.body,
    fontWeight: "600",
    color: colors.surface,
  },
  footerHint: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: "center",
  },
});
