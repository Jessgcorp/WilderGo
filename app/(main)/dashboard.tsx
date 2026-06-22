import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, typography, spacing } from "@/constants/theme";

export default function MainDashboardRedirect() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    router.replace("/map");
  }, [router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}> 
      <Text style={styles.message}>Loading dashboard…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  message: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.lg,
    textAlign: "center",
  },
});
