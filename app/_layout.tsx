import { useEffect, useCallback } from "react";
import { Stack, useRouter, useRootNavigationState } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text, ActivityIndicator, LogBox, Pressable } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { RussoOne_400Regular } from "@expo-google-fonts/russo-one";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
} from "@expo-google-fonts/outfit";
import { colors } from "@/constants/theme";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ModeProvider } from "@/contexts/ModeContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

LogBox.ignoreAllLogs();

SplashScreen.preventAutoHideAsync();

// Global splash screen timeout: 7 seconds (ensures proper font loading and app initialization)
// Will not be overridden by any other loading state
const GLOBAL_SPLASH_TIMEOUT = 7000;
setTimeout(() => {
  SplashScreen.hideAsync().catch(() => {});
}, GLOBAL_SPLASH_TIMEOUT);

function AuthenticatedLayout() {
  const { user, isLoading, serviceError, clearServiceError } = useAuth();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (isLoading) return;
    if (!navigationState?.key) return;
    if (serviceError && !user) return;

    if (!user) {
      router.replace("/(onboarding)/welcome" as any);
      return;
    }

    const onboardingRoute = (() => {
      if (!user.emailVerified) return "/(onboarding)/email-verification";
      if (!user.selfieSubmitted && !user.selfieVerified)
        return "/(onboarding)/selfie-verify";
      if (!user.vehicle) return "/(onboarding)/vehicle-select";
      if (!user.nomadStyle) return "/(onboarding)/nomad-style";
      if (!user.onboardingComplete) return "/(onboarding)/complete";
      return "/(tabs)";
    })();

    router.replace(onboardingRoute as any);
  }, [isLoading, navigationState?.key, router, serviceError, user]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background.primary,
        }}
      >
        <ActivityIndicator size="large" color={colors.ember[500]} />
      </View>
    );
  }

  if (serviceError && !user) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
          backgroundColor: colors.background.primary,
        }}
      >
        <Text
          style={{
            color: colors.text.primary,
            fontSize: 20,
            fontWeight: "700",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Service Unavailable
        </Text>
        <Text
          style={{
            color: colors.text.secondary,
            fontSize: 16,
            lineHeight: 24,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          {serviceError}
        </Text>
        <Pressable
          onPress={clearServiceError}
          style={{
            backgroundColor: colors.ember[500],
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            Retry
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.primary },
        animation: "slide_from_right",
      }}
    />
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    DelaGothicOne_400Regular: require("../assets/fonts/DelaGothicOne-Regular.ttf"),
    RussoOne_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ModeProvider>
            <SafeAreaProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <KeyboardProvider>
                  <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
                    <StatusBar style="light" hidden />
                    <AuthenticatedLayout />
                  </View>
                </KeyboardProvider>
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </ModeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
