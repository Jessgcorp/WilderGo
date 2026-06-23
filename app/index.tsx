import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { safeReplace } from "./lib/safeRouter";
import { colors, typography, spacing } from "@/constants/theme";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/contexts/AuthContext";

export default function SplashScreen() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Wait until the auth state has finished loading
    if (isLoading) return;

    // If there's no user, go to the visible login flow.
    // If the user exists, navigate to a safe, known authenticated route.
    // Avoid navigating to undefined routes (which causes the crash "trying to
    // navigate to a screen that is not defined in the navigator").
    if (!user) {
      safeReplace(router, "./(auth)/login".replace('./', '/'));
    } else {
      // Use a safe authenticated landing route that exists in the project.
      // The tabs layout exposes an "explore" screen, so navigate there.
      safeReplace(router, "./(tabs)/explore".replace('./', '/'));
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/images/WilderGo_Logo_512h.png")}
        style={[
          styles.logoImage,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        resizeMode="contain"
      />
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Logo size="hero" variant="dark" showTagline />
        <View style={styles.taglineContainer}>
          <View style={styles.divider} />
          <Text style={styles.tagline}>NOMADIC COMMUNITY</Text>
          <View style={styles.divider} />
        </View>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <ActivityIndicator
          size="small"
          color={colors.moss[500]}
          style={{ marginBottom: spacing.sm }}
        />
        <Text style={styles.footerText}>The road is better together</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logoImage: {
    width: 132,
    height: 132,
    marginBottom: spacing.lg,
  },
  taglineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: colors.bark[300],
    marginHorizontal: spacing.md,
  },
  tagline: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bodySemiBold,
    color: colors.moss[600],
    letterSpacing: 3,
  },
  footer: {
    position: "absolute",
    bottom: 60,
    alignItems: "center",
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.body,
    color: colors.text.tertiary,
    fontStyle: "italic",
  },
});
