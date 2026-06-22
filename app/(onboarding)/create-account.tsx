import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Linking,
  useWindowDimensions,
} from "react-native";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "@/constants/theme";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { NatureBackground } from "@/components/ui/NatureBackground";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/contexts/AuthContext";
import {
  isReviewerBypassEmail,
  REVIEWER_ACCOUNT_EMAIL,
  REVIEWER_ACCOUNT_PASSWORD,
} from "@/lib/reviewerBypass";

const PRIVACY_POLICY_URL = "https://wildergoapp.com/privacy-policy";

export default function CreateAccountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const horizontalPadding = windowWidth <= 360 ? spacing.lg : spacing.xl;
  const { signUp, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  const params = useLocalSearchParams<{ autoReviewerLogin?: string }>();

  useEffect(() => {
    const initReviewerLogin = async () => {
      if (params.autoReviewerLogin === "true") {
        setIsSignIn(true);
        setEmail(REVIEWER_ACCOUNT_EMAIL);
        setPassword(REVIEWER_ACCOUNT_PASSWORD);
        setError("");

        const result = await signIn(
          REVIEWER_ACCOUNT_EMAIL,
          REVIEWER_ACCOUNT_PASSWORD,
        );

        if (result.success) {
          router.replace("/dashboard" as any);
        }
      }
    };

    initReviewerLogin();
  }, [params.autoReviewerLogin, router, signIn]);

  const handleSignIn = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const result = await signIn(normalizedEmail, password);
    console.log(`[CREATE ACCOUNT] signIn result:`, JSON.stringify(result));
    if (result.success) {
      console.log("[CREATE ACCOUNT] signIn succeeded, auto-navigating to dashboard");
      router.replace("/dashboard" as any);
      return;
    }

    console.log(`[CREATE ACCOUNT] signIn failed: ${result.message}`);
    setError(result.message || "Sign in failed");
  };

  const handleReviewerAccess = async () => {
    router.replace("/(tabs)/explore");
  };

  const handleCreateAccount = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const isReviewerAccount = isReviewerBypassEmail(normalizedEmail);

    console.log(
      `[CREATE ACCOUNT] Button pressed! isSignIn=${isSignIn}, email="${normalizedEmail}"`,
    );
    setError("");

    if (isReviewerAccount && !isSignIn) {
      console.log(
        `[CREATE ACCOUNT] Reviewer bypass activated for ${normalizedEmail}: signing in and navigating to dashboard`,
      );
      const result = await signIn(normalizedEmail, password);
      if (result.success) {
        router.replace("/dashboard" as any);
      } else {
        setError(result.message || "Reviewer login failed");
      }
      return;
    }

    if (isSignIn) {
      return handleSignIn();
    }

    if (!normalizedEmail) {
      console.log(`[CREATE ACCOUNT] Validation failed: empty email`);
      setError("Please enter your email address");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      console.log(`[CREATE ACCOUNT] Validation failed: invalid email format`);
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      console.log(`[CREATE ACCOUNT] Validation failed: password too short`);
      setError("Password must be at least 6 characters");
      return;
    }

    if (!isSignIn && password !== confirmPassword) {
      console.log(`[CREATE ACCOUNT] Validation failed: passwords don't match`);
      setError("Passwords do not match");
      return;
    }

    console.log(
      `[CREATE ACCOUNT] Validation passed, calling ${isSignIn ? "signIn" : "signUp"}...`,
    );
    setLoading(true);

    try {
      if (isSignIn) {
        console.log(`[CREATE ACCOUNT] Calling signIn...`);
        const result = await signIn(normalizedEmail, password);
        console.log(`[CREATE ACCOUNT] signIn result:`, JSON.stringify(result));
        if (result.success) {
          console.log(
            "[CREATE ACCOUNT] signIn succeeded, auto-navigating to dashboard",
          );
          router.replace("/dashboard" as any);
          return;
        }

        console.log(`[CREATE ACCOUNT] signIn failed: ${result.message}`);
        setError(result.message || "Sign in failed");
      } else {
        console.log(`[CREATE ACCOUNT] Calling signUp...`);
        const result = await signUp(normalizedEmail, password);
        console.log(`[CREATE ACCOUNT] signUp result:`, JSON.stringify(result));
        if (result.success) {
          console.log(
            `[CREATE ACCOUNT] signUp succeeded, auto-logging in and navigating to home`,
          );
          router.replace("/dashboard" as any);
          return;
        }

        console.log(`[CREATE ACCOUNT] signUp failed: ${result.message}`);
        setError(result.message || "Account creation failed");
      }
    } catch (err: any) {
      console.error(`[CREATE ACCOUNT] Unexpected error:`, err.message);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <NatureBackground variant="utah" overlay overlayOpacity={0.55}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + spacing.lg,
              paddingBottom: insets.bottom + spacing.xl + 100,
              paddingHorizontal: horizontalPadding,
            },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            testID="button-back"
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.inverse} />
          </TouchableOpacity>

          <View style={styles.headerSection}>
            <Logo size="large" variant="light" />
            <Text style={styles.title}>
              {isSignIn ? "Welcome Back" : "Create Account"}
            </Text>
            <Text style={styles.subtitle}>
              {isSignIn
                ? "Sign in with email and password to continue your journey"
                : "Create your WilderGo account using email and password"}
            </Text>
            <Text style={styles.smallNote}>
              Please use your email and password to sign in.
            </Text>
            <Text style={styles.smallNote}>
              Apple Sign-In is not supported.
            </Text>
          </View>

          <GlassCard
            variant="frost"
            padding="lg"
            style={[styles.formCard, styles.warmCard]}
          >
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.bark[400]}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="yourname@email.com"
                  placeholderTextColor={colors.bark[400]}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  testID="input-email"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.bark[400]}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Min. 6 characters"
                  placeholderTextColor={colors.bark[400]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  testID="input-password"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.bark[400]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {!isSignIn ? (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={colors.bark[400]}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Re-enter password"
                    placeholderTextColor={colors.bark[400]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    testID="input-confirm-password"
                  />
                </View>
              </View>
            ) : null}

            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="alert-circle"
                  size={16}
                  color={colors.ember[500]}
                />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Button
              title={
                loading
                  ? isSignIn
                    ? "Signing In..."
                    : "Creating Account..."
                  : isSignIn
                    ? "Sign In"
                    : "Create Account"
              }
              onPress={handleCreateAccount}
              variant="ember"
              size="lg"
              fullWidth
              style={styles.primaryButton}
              disabled={loading}
              testID="button-create-account"
            />
          </GlassCard>

          {!isSignIn ? (
            <View style={styles.safetyNotice}>
              <Ionicons
                name="shield-checkmark"
                size={16}
                color={colors.moss[400]}
              />
              <Text style={styles.safetyNoticeText}>
                By signing up, you agree to verify your identity with a selfie
                to keep our community safe.
              </Text>
            </View>
          ) : (
            <View style={styles.reviewerInfo}>
              <Text style={styles.reviewerHeading}>Reviewer access</Text>
              <Text style={styles.reviewerText}>
                Use the dedicated Apple reviewer account to sign in during
                review.
              </Text>
              <Text
                style={styles.reviewerCredentials}
                testID="reviewer-credentials"
              >
                {REVIEWER_ACCOUNT_EMAIL}
                {"\n"}
                {REVIEWER_ACCOUNT_PASSWORD}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => {
              setIsSignIn(!isSignIn);
              setError("");
            }}
            testID="button-switch-mode"
          >
            <Text style={styles.switchText}>
              {isSignIn
                ? "Don't have an account? "
                : "Already have an account? "}
              <Text style={styles.switchTextBold}>
                {isSignIn ? "Create one" : "Sign in"}
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
            style={styles.privacyLink}
            testID="button-privacy-policy"
          >
            <Text style={styles.privacyLinkText}>Privacy Policy</Text>
          </TouchableOpacity>

          <View pointerEvents="box-none">
            <Link href="/(tabs)/explore" asChild>
              <TouchableOpacity
                style={styles.reviewerAccessButton}
                disabled={loading}
                testID="button-reviewer-access"
              >
                <Text style={styles.reviewerAccessText}>Reviewer Access</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </NatureBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.glass.whiteMedium,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: spacing["2xl"],
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontFamily: typography.fontFamily.heading,
    color: colors.text.inverse,
    marginTop: spacing.lg,
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.body,
    color: colors.bark[300],
    marginTop: spacing.sm,
    textAlign: "center",
  },
  formCard: {
    borderRadius: borderRadius["2xl"],
  },
  warmCard: {
    backgroundColor: "rgba(233, 150, 122, 0.16)",
    borderColor: "rgba(210, 105, 30, 0.18)",
  },
  primaryButton: {
    backgroundColor: "#8B4513",
    borderColor: "#8B4513",
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bodySemiBold,
    color: colors.bark[700],
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bark[100],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.bark[200],
    paddingHorizontal: spacing.md,
    height: 52,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.body,
    color: colors.bark[900],
    height: "100%",
  },
  eyeButton: {
    padding: spacing.xs,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(233, 150, 122, 0.14)",
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.body,
    color: "#D2691E",
    flex: 1,
  },
  safetyNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: spacing.lg,
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  safetyNoticeText: {
    flex: 1,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.body,
    color: colors.bark[300],
    lineHeight: 18,
  },
  reviewerInfo: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: "rgba(233, 150, 122, 0.12)",
    borderRadius: borderRadius.lg,
  },
  reviewerHeading: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bodySemiBold,
    color: colors.bark[900],
    marginBottom: spacing.xs,
  },
  reviewerText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.body,
    color: colors.bark[400],
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  reviewerCredentials: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.body,
    color: colors.bark[700],
    backgroundColor: colors.glass.whiteMedium,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  privacyLink: {
    marginTop: spacing.lg,
    alignSelf: "center",
  },
  privacyLinkText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bodySemiBold,
    color: "#E9967A",
    textDecorationLine: "underline",
  },
  smallNote: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.body,
    color: colors.bark[300],
    marginTop: spacing.sm,
    textAlign: "center",
  },
  switchButton: {
    alignItems: "center",
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  switchText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.body,
    color: colors.text.inverse,
  },
  switchTextBold: {
    fontFamily: typography.fontFamily.bodySemiBold,
    color: "#D2691E",
  },
  reviewerAccessButton: {
    marginTop: spacing.lg,
    alignSelf: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(210, 105, 30, 0.14)",
    borderWidth: 1,
    borderColor: "#D2691E",
    opacity: 0.98,
  },
  reviewerAccessText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.body,
    color: "#F5EFE6",
  },
});
