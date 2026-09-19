import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/auth-context";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    const result = await signUp(email.trim(), password);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/(auth)/login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Sign up to start analyzing your skincare products.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            accessibilityLabel="Email"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            autoComplete="new-password"
            accessibilityLabel="Password"
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSubmit}
            disabled={submitting}
            accessibilityRole="button"
            accessibilityLabel={submitting ? "Signing up" : "Sign up"}
          >
            <Text style={styles.buttonText}>
              {submitting ? "Signing up..." : "Sign Up"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.linkButton}
            onPress={() => router.push("/(auth)/login")}
            accessibilityRole="link"
            accessibilityLabel="Go to login"
          >
            <Text style={styles.linkText}>
              Already have an account? Log in
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
  },
  label: {
    ...typography.bodySmall,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.body,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.input,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.text,
    minHeight: 48,
  },
  error: {
    ...typography.bodySmall,
    color: colors.danger,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.input,
    paddingVertical: spacing.md,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
    marginTop: spacing.sm,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    ...typography.body,
    fontWeight: "600",
    color: colors.surface,
  },
  linkButton: {
    alignItems: "center",
    paddingVertical: spacing.md,
    minHeight: 44,
    justifyContent: "center",
  },
  linkText: {
    ...typography.body,
    color: colors.primary,
  },
});
