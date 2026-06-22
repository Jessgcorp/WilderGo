import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { colors, typography, spacing, borderRadius } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";

export default function VehicleSelectScreen() {
  const router = useRouter();
  const { updateProfile, user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleContinue = async () => {
    if (!user) {
      router.replace("/(onboarding)/nomad-style");
      return;
    }

    setIsSaving(true);
    await updateProfile({ vehicle: "Sprinter 144" });
    setIsSaving(false);
    router.replace("/(onboarding)/nomad-style");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Vehicle</Text>
      <Text style={styles.description}>
        Choose a vehicle foundation for your Nomad Passport. This screen is a
        placeholder until the real vehicle selection flow is added.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleContinue}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.heading,
    color: colors.bark[800],
    marginBottom: spacing.md,
    textAlign: "center",
  },
  description: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.body,
    color: colors.bark[700],
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.ember[500],
  },
  buttonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bodySemiBold,
    color: "#FFFFFF",
  },
});
