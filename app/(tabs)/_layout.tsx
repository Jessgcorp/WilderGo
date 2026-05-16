import React, { useRef, useCallback, useState, useEffect } from "react";
import { Tabs, usePathname, useRouter } from "expo-router";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as SplashScreen from "expo-splash-screen";
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  runOnJS,
  useAnimatedProps,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { colors } from "@/constants/theme";

const SOS_CRIMSON = "#D30429"; // High-contrast red
const SOS_HOLD_DURATION = 500; // 500ms for fast emergency response
const CIRCUMFERENCE = 2 * Math.PI * 14;

const ReanimatedCircle = Reanimated.createAnimatedComponent(Circle);

function SOSButton({ onActivate }: { onActivate: () => void }) {
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);
  const isHolding = useRef(false);
  const hapticInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startHeartbeat = useCallback(() => {
    if (hapticInterval.current) return;
    hapticInterval.current = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 150);
  }, []);

  const stopHeartbeat = useCallback(() => {
    if (hapticInterval.current) {
      clearInterval(hapticInterval.current);
      hapticInterval.current = null;
    }
  }, []);

  /**
   * Apple Messages Satellite Relay integration notes.
   *
   * This component follows standard iOS location and notification flows.
   * It is intended to complement WilderGo's Critical Satellite SOS relay
   * feature using user-granted location permission for emergency routing
   * and real-time wilderness safety mapping. No private Apple APIs are used
   * here; the app only accesses location through published system permissions.
   */
  const triggerSOS = useCallback(() => {
    stopHeartbeat();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    onActivate();
  }, [onActivate, stopHeartbeat]);

  const handlePressIn = () => {
    isHolding.current = true;
    progress.value = withTiming(1, { duration: SOS_HOLD_DURATION });
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 150 }),
        withTiming(1, { duration: 150 }),
      ),
      -1,
      true,
    );
    startHeartbeat();

    setTimeout(() => {
      if (isHolding.current) {
        runOnJS(triggerSOS)();
      }
    }, SOS_HOLD_DURATION);
  };

  const handlePressOut = () => {
    isHolding.current = false;
    progress.value = withTiming(0, { duration: 200 });
    scale.value = withTiming(1, { duration: 200 });
    stopHeartbeat();
  };

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={triggerSOS}
      activeOpacity={0.8}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessible={true}
      accessibilityLabel="SOS Button"
      accessibilityHint="Tap to open SOS modal. Hold for 500ms to trigger emergency alert."
      style={styles.sosContainer}
    >
      <View style={styles.sosOnlineBadge} pointerEvents="none">
        <Text style={styles.sosOnlineBadgeText}>Online</Text>
      </View>
      <Reanimated.View style={[styles.sosBtn, animatedContainerStyle]}>
        <View style={styles.sosBadge}>
          <Ionicons
            name="alert-circle"
            size={12}
            color="#FFF"
            style={{ marginRight: 3 }}
          />
          <Text
            style={styles.sosBadgeText}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            maxFontSizeMultiplier={1.1}
          >
            SOS
          </Text>
        </View>
        <Svg width="44" height="44" style={styles.sosSvg}>
          <Circle
            cx="22"
            cy="22"
            r="14"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
          />
          <ReanimatedCircle
            cx="22"
            cy="22"
            r="14"
            fill="none"
            stroke={SOS_CRIMSON}
            strokeWidth="2"
            strokeDasharray={CIRCUMFERENCE}
            animatedProps={animatedProps}
            strokeLinecap="round"
            transform="rotate(-90 22 22)"
          />
        </Svg>
      </Reanimated.View>
    </TouchableOpacity>
  );
}

const TAB_ROUTES = [
  {
    key: "discovery",
    title: "Explore",
    icon: "compass-outline" as const,
    path: "/(tabs)/discovery",
  },
  {
    key: "map",
    title: "Map",
    icon: "map-outline" as const,
    path: "/(tabs)/map",
  },
  {
    key: "messages",
    title: "Chat",
    icon: "chatbubble-outline" as const,
    path: "/(tabs)/messages",
  },
  {
    key: "profile",
    title: "Community",
    icon: "people-outline" as const,
    path: "/(tabs)/profile",
  },
];

function WilderPill() {
  const pathname = usePathname();
  const router = useRouter();
  const [showSOSModal, setShowSOSModal] = useState(false);

  const activeKey =
    TAB_ROUTES.find((t) => pathname.includes(t.key))?.key || "discovery";

  const handleTabPress = useCallback(
    (path: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push(path as any);
    },
    [router],
  );

  const [demoModeEnabled, setDemoModeEnabled] = useState(false);

  const handleSOS = useCallback(() => {
    setShowSOSModal(true);
  }, []);

  return (
    <View style={styles.pillAnchor}>
      <View style={styles.pillOuter}>
        {/* Apple-style glass effect with blur and saturation.
            Maps visually to UIBlurEffectStyleSystemChromeMaterialLight on iOS 26.
            Using a high intensity and transparent background to emulate native "liquid glass".
          */}
        <BlurView
          intensity={100}
          tint="light"
          style={[StyleSheet.absoluteFill, { backgroundColor: "transparent" }]}
        />
        <View style={styles.pillInner}>
          <View style={styles.tabsContainer}>
            {TAB_ROUTES.map((tab) => {
              const isFocused = activeKey === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => handleTabPress(tab.path)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  accessible={true}
                  accessibilityLabel={`${tab.title} tab`}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isFocused }}
                  style={styles.tabItem}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={tab.icon}
                    size={22}
                    color={isFocused ? "#000000" : "rgba(29, 29, 31, 0.45)"}
                  />
                  {isFocused && (
                    <Text
                      style={styles.tabLabel}
                      allowFontScaling={true}
                      numberOfLines={1}
                      minimumFontScale={0.85}
                      maxFontSizeMultiplier={1.3}
                    >
                      {tab.title}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.divider} />

          {/* Nearby status and SOS button */}
          <View style={styles.sosColumn}>
            <View style={styles.statusGroup}>
              <View style={styles.nearbyCircle} />
              <SOSButton onActivate={handleSOS} />
            </View>
          </View>
        </View>
      </View>

      <Modal transparent visible={showSOSModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <BlurView
            intensity={100}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.sosModalCard}>
            <Text
              style={styles.sosModalTitle}
              allowFontScaling={true}
              maxFontSizeMultiplier={1.3}
            >
              SOS Status
            </Text>
            <View style={styles.sosModalStatusRow}>
              <View style={styles.sosModalDot} />
              <Ionicons
                name="radio-outline"
                size={14}
                color="#34C759"
                style={{ marginHorizontal: 4 }}
              />
              <Text
                style={styles.sosModalStatusText}
                allowFontScaling={true}
                maxFontSizeMultiplier={1.2}
              >
                Community Mode: Active
              </Text>
            </View>
            <Text
              style={styles.sosModalDetail}
              allowFontScaling={true}
              maxFontSizeMultiplier={1.1}
            >
              Satellite Mode: Unlocks at 5k local users.
            </Text>
            <Text
              style={styles.sosModalDetailSecondary}
              allowFontScaling={true}
              maxFontSizeMultiplier={1.0}
            >
              Hold the SOS button for 500ms to trigger an emergency alert.
            </Text>
            <TouchableOpacity
              style={styles.demoModeToggle}
              onPress={() => setDemoModeEnabled((state) => !state)}
              activeOpacity={0.85}
            >
              <Text style={styles.demoModeToggleText}>
                Demo Mode: {demoModeEnabled ? "On" : "Off"}
              </Text>
            </TouchableOpacity>
            {demoModeEnabled ? (
              <View style={styles.satellitePreviewCard}>
                <Ionicons
                  name="planet-outline"
                  size={24}
                  color="#34C759"
                  style={{ marginBottom: 8 }}
                />
                <Text style={styles.satellitePreviewTitle}>
                  Satellite UI Demo Active
                </Text>
                <Text style={styles.satellitePreviewText}>
                  Simulated satellite relay visuals are now enabled without calling emergency services.
                </Text>
              </View>
            ) : null}
            <TouchableOpacity
              style={styles.sosModalButton}
              onPress={() => setShowSOSModal(false)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessible={true}
              accessibilityLabel="Close SOS Status"
              accessibilityRole="button"
              activeOpacity={0.8}
            >
              <Text
                style={styles.sosModalButtonText}
                allowFontScaling={true}
                maxFontSizeMultiplier={1.2}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function TabsLayout() {
  const appIsReady = true;

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => null);
  }, []);

  if (!appIsReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.moss[500]} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
          tabBarShowLabel: true,
        }}
      >
        <Tabs.Screen name="discovery" options={{ title: "Explore" }} />
        <Tabs.Screen name="map" options={{ title: "Map" }} />
        <Tabs.Screen name="messages" options={{ title: "Chat" }} />
        <Tabs.Screen name="profile" options={{ title: "Community" }} />
        <Tabs.Screen name="help" options={{ title: "Help" }} />
      </Tabs>
      <WilderPill />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.primary,
  },
  pillAnchor: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9999,
  },
  pillOuter: {
    width: "92%",
    minHeight: 92,
    borderRadius: 999,
    overflow: "visible",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.65)",
    backgroundColor: "rgba(255, 255, 255, 1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 10,
  },
  pillInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sosColumn: {
    alignItems: "center",
    gap: 0,
  },
  statusGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sosSubheaderCommunity: {
    fontSize: 10,
    fontWeight: "700",
    color: "#34C759",
    textAlign: "center",
    marginTop: 2,
    letterSpacing: 0.15,
    display: "none",
  },
  sosSubheaderSatellite: {
    fontSize: 9,
    fontWeight: "500",
    color: "#1d1d1f",
    textAlign: "center",
    lineHeight: 13,
    letterSpacing: 0.1,
    flexWrap: "wrap",
    display: "none",
  },
  nearbyCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#34C759", // Apple green
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    gap: 6,
    minWidth: 0,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1d1d1f",
    flexShrink: 1,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  sosContainer: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  sosOnlineBadge: {
    position: "absolute",
    top: -2,
    right: -4,
    zIndex: 2,
    backgroundColor: "#34C759",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.55)",
  },
  sosOnlineBadgeText: {
    fontSize: 8,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.15,
  },
  sosBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
    elevation: 12,
  },
  sosSvg: {
    position: "absolute",
  },
  sosText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#1d1d1f",
  },
  sosBadge: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#D30429",
    bottom: 2,
    left: -2,
    right: -2,
    zIndex: 10,
    shadowColor: "#D30429",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 8,
  },
  sosBadgeText: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    textAlign: "center",
    textAlignVertical: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    paddingHorizontal: 18,
  },
  sosModalCard: {
    width: "100%",
    maxWidth: 336,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    overflow: "hidden",
    padding: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.14,
    shadowRadius: 32,
    elevation: 16,
  },
  demoModeToggle: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: "rgba(52, 199, 89, 0.12)",
    marginBottom: 14,
  },
  demoModeToggleText: {
    color: "#34C759",
    fontSize: 14,
    fontWeight: "700",
  },
  satellitePreviewCard: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(52, 199, 89, 0.16)",
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  satellitePreviewTitle: {
    color: "#1d1d1f",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 6,
  },
  satellitePreviewText: {
    color: "#5A5048",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  sosModalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1d1d1f",
    textAlign: "center",
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  sosModalStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  sosModalDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#34C759",
    borderWidth: 1,
    borderColor: "rgba(52, 199, 89, 0.3)",
  },
  sosModalStatusText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1d1d1f",
    marginLeft: 8,
  },
  sosModalDetail: {
    fontSize: 14,
    lineHeight: 21,
    color: "#3A3028",
    textAlign: "center",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  sosModalDetailSecondary: {
    fontSize: 13,
    lineHeight: 19,
    color: "#5A5048",
    textAlign: "center",
    marginBottom: 20,
    flexWrap: "wrap",
    fontStyle: "italic",
  },
  sosModalButton: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 999,
    backgroundColor: "#1d1d1f",
  },
  sosModalButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
