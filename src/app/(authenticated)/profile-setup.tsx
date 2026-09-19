import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSkinProfile } from "@/hooks/use-skin-profile";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import type {
  SkinType,
  SkinConcern,
  AgeGroup,
  SensitivityLevel,
} from "@/types/supabase";

const SKIN_TYPES: SkinType[] = [
  "oily",
  "dry",
  "combination",
  "normal",
  "sensitive",
];
const CONCERNS: SkinConcern[] = [
  "acne",
  "aging",
  "hyperpigmentation",
  "redness",
  "dehydration",
  "texture",
];
const AGE_GROUPS: AgeGroup[] = ["18-24", "25-34", "35-44", "45+"];
const SENSITIVITY_LEVELS: SensitivityLevel[] = ["low", "medium", "high"];

function label(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { saveProfile } = useSkinProfile();

  const [skinType, setSkinType] = useState<SkinType | null>(null);
  const [concerns, setConcerns] = useState<SkinConcern[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [sensitivity, setSensitivity] = useState<SensitivityLevel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleConcern = (c: SkinConcern) => {
    setConcerns((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  };

  const addAllergy = () => {
    const trimmed = allergyInput.trim();
    if (trimmed && !allergies.includes(trimmed)) {
      setAllergies((prev) => [...prev, trimmed]);
      setAllergyInput("");
    }
  };

  const removeAllergy = (a: string) => {
    setAllergies((prev) => prev.filter((x) => x !== a));
  };

  const handleSubmit = async () => {
    setError(null);

    if (!skinType) {
      setError("Please select your skin type.");
      return;
    }
    if (concerns.length === 0) {
      setError("Please select at least one concern.");
      return;
    }
    if (!ageGroup) {
      setError("Please select your age group.");
      return;
    }
    if (!sensitivity) {
      setError("Please select your sensitivity level.");
      return;
    }

    setSubmitting(true);
    const result = await saveProfile({
      skin_type: skinType,
      concerns,
      allergies,
      age_group: ageGroup,
      sensitivity_level: sensitivity,
    });
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.replace("/(authenticated)");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Skin Profile</Text>
        <Text style={styles.subtitle}>
          Tell us about your skin so we can personalize your analysis.
        </Text>

        {/* Skin Type */}
        <Text style={styles.label}>Skin Type</Text>
        <View style={styles.chipRow}>
          {SKIN_TYPES.map((st) => (
            <Pressable
              key={st}
              style={[
                styles.chip,
                skinType === st && styles.chipSelected,
              ]}
              onPress={() => setSkinType(st)}
              accessibilityRole="radio"
              accessibilityState={{ checked: skinType === st }}
              accessibilityLabel={label(st)}
            >
              <Text
                style={[
                  styles.chipText,
                  skinType === st && styles.chipTextSelected,
                ]}
              >
                {label(st)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Concerns */}
        <Text style={styles.label}>Concerns</Text>
        <View style={styles.chipRow}>
          {CONCERNS.map((c) => (
            <Pressable
              key={c}
              style={[
                styles.chip,
                concerns.includes(c) && styles.chipSelected,
              ]}
              onPress={() => toggleConcern(c)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: concerns.includes(c) }}
              accessibilityLabel={label(c)}
            >
              <Text
                style={[
                  styles.chipText,
                  concerns.includes(c) && styles.chipTextSelected,
                ]}
              >
                {label(c)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Allergies */}
        <Text style={styles.label}>Allergies</Text>
        <View style={styles.allergyInputRow}>
          <TextInput
            style={styles.allergyInput}
            value={allergyInput}
            onChangeText={setAllergyInput}
            placeholder="Type an allergy"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="words"
            accessibilityLabel="Allergy input"
          />
          <Pressable
            style={styles.addAllergyButton}
            onPress={addAllergy}
            accessibilityRole="button"
            accessibilityLabel="Add allergy"
          >
            <Ionicons name="add" size={20} color={colors.surface} />
          </Pressable>
        </View>
        <View style={styles.chipRow}>
          {allergies.map((a) => (
            <Pressable
              key={a}
              style={[styles.chip, styles.chipAllergy]}
              onPress={() => removeAllergy(a)}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${a}`}
            >
              <Text style={styles.chipText}>{a}</Text>
              <Ionicons name="close-circle" size={16} color={colors.text} />
            </Pressable>
          ))}
        </View>

        {/* Age Group */}
        <Text style={styles.label}>Age Group</Text>
        <View style={styles.chipRow}>
          {AGE_GROUPS.map((ag) => (
            <Pressable
              key={ag}
              style={[
                styles.chip,
                ageGroup === ag && styles.chipSelected,
              ]}
              onPress={() => setAgeGroup(ag)}
              accessibilityRole="radio"
              accessibilityState={{ checked: ageGroup === ag }}
              accessibilityLabel={ag}
            >
              <Text
                style={[
                  styles.chipText,
                  ageGroup === ag && styles.chipTextSelected,
                ]}
              >
                {ag}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Sensitivity Level */}
        <Text style={styles.label}>Sensitivity Level</Text>
        <View style={styles.chipRow}>
          {SENSITIVITY_LEVELS.map((sl) => (
            <Pressable
              key={sl}
              style={[
                styles.chip,
                sensitivity === sl && styles.chipSelected,
              ]}
              onPress={() => setSensitivity(sl)}
              accessibilityRole="radio"
              accessibilityState={{ checked: sensitivity === sl }}
              accessibilityLabel={label(sl)}
            >
              <Text
                style={[
                  styles.chipText,
                  sensitivity === sl && styles.chipTextSelected,
                ]}
              >
                {label(sl)}
              </Text>
            </Pressable>
          ))}
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleSubmit}
          disabled={submitting}
          accessibilityRole="button"
          accessibilityLabel={submitting ? "Saving profile" : "Save profile"}
        >
          <Text style={styles.buttonText}>
            {submitting ? "Saving..." : "Save Profile"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.bodySmall,
    fontWeight: "600",
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
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
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipAllergy: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  chipText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.surface,
  },
  allergyInputRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  allergyInput: {
    ...typography.body,
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.input,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    color: colors.text,
    minHeight: 44,
  },
  addAllergyButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.input,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    ...typography.bodySmall,
    color: colors.danger,
    marginTop: spacing.sm,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.input,
    paddingVertical: spacing.md,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
    marginTop: spacing.lg,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    ...typography.body,
    fontWeight: "600",
    color: colors.surface,
  },
});
