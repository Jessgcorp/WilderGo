import { useEffect, useCallback } from "react";
import {
  Stack,
  useRouter,
  useSegments,
  useRootNavigationState,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, LogBox } from "react-native";
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

// Emergency splash screen hide in case fonts don't load
setTimeout(() => {
  SplashScreen.hideAsync().catch(() => {});
}, 3000);

function AuthenticatedLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (isLoading) return;
    if (!navigationState?.key) return;

    // TEMPORARY AUTH BYPASS FOR MAP DEBUGGING
    // Commented out the normal auth redirect flow and force the map tab directly.
    router.replace("/(tabs)/map" as any);
  }, [isLoading, navigationState?.key, router]);

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
                    <StatusBar style="light" />
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
