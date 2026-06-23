import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { safeReplace } from "../lib/safeRouter";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { NatureBackground } from "@/components/ui/NatureBackground";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "@/constants/theme";

export default function AuthLoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Ensure navigating to a defined route. Use safeReplace to avoid throwing
      // if the target route is not available for any reason.
      safeReplace(router, "/(tabs)/explore");
    }
  }, [user, router]);

  const handleSignIn = async () => {
    setError("");
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setError("Please enter your email and password.");
      setLoading(false);
      return;
    }

    const result = await signIn(normalizedEmail, password);
    if (result.success) {
      // Use a safe authenticated landing route
      safeReplace(router, "/(tabs)/explore");
    } else {
      setError(result.message || "Sign in failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <NatureBackground variant="utah" overlay overlayOpacity={0.58}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={[
            styles.content,
            { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.lg },
          ]}
        >
          <View style={styles.brandHeader}>
            <Logo size="hero" variant="light" showTagline />
            <Text style={styles.subtitle}>Sign in to WilderGo</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="you@nomadmail.com"
              placeholderTextColor={colors.bark[300]}
              style={styles.input}
              autoComplete="email"
              textContentType="emailAddress"
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Enter your password"
              placeholderTextColor={colors.bark[300]}
              style={styles.input}
              autoComplete="password"
              textContentType="password"
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Button
              title="Sign In"
              onPress={handleSignIn}
              loading={loading}
              variant="ember"
              size="lg"
              fullWidth
              style={styles.signInButton}
            />

            <TouchableOpacity
              style={styles.createAccountLink}
              onPress={() => router.push("/(onboarding)/create-account")}
            >
              <Text style={styles.createAccountText}>
                New to WilderGo? Create your account.
              </Text>
            </TouchableOpacity>

            <View pointerEvents="box-none">
              <Pressable
                onPress={() => {
                  console.log("Button Pressed");
                  router.replace("/(tabs)/explore");
                }}
                style={styles.reviewerAccessButton}
              >
                <Ionicons name="shield-checkmark" size={18} color={colors.canyonRust[500]} />
                <Text style={styles.reviewerAccessText}>Reviewer Access</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </NatureBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: "center",
    gap: spacing.lg,
    zIndex: 99999,
  },
  brandHeader: {
    alignItems: "center",
    gap: spacing.sm,
  },
  subtitle: {
    color: colors.text.inverse,
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.md,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  formCard: {
    backgroundColor: colors.glass.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.canyonRust[200],
    shadowColor: colors.ironOxide[500],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  label: {
    color: colors.bark[800],
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.sm,
  },
  input: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.canyonRust[200],
    color: colors.bark[900],
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
  },
  errorText: {
    color: colors.error,
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.xs,
  },
  signInButton: {
    marginTop: spacing.sm,
  },
  createAccountLink: {
    marginTop: spacing.sm,
    alignItems: "center",
  },
  createAccountText: {
    color: colors.bark[600],
    fontFamily: typography.fontFamily.bodySemiBold,
  },
  reviewerAccessButton: {
    marginTop: spacing.sm,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.canyonRust[500],
    backgroundColor: colors.glass.whiteLight,
  },
  reviewerAccessText: {
    color: colors.canyonRust[500],
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.sm,
  },
});
