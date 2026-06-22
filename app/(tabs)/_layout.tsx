import React, { useCallback, useEffect, useState } from "react";
import { Tabs, usePathname, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import {
  GlassContainer,
  GlassView,
  isGlassEffectAPIAvailable,
} from "expo-glass-effect";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as SplashScreen from "expo-splash-screen";
import { colors } from "@/constants/theme";

const SOS_CRIMSON = "#D30429";

type TabRoute = {
  key: string;
  title: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  path: string;
};

const TAB_ROUTES: TabRoute[] = [
  {
    key: "discovery",
    title: "Explore",
    icon: "compass-outline",
    path: "/(tabs)/discovery",
  },
  {
    key: "map",
    title: "Map",
    icon: "map-outline",
    path: "/(tabs)/map",
  },
  {
    key: "messages",
    title: "Chat",
    icon: "chatbubble-outline",
    path: "/(tabs)/messages",
  },
  {
    key: "profile",
    title: "Community",
    icon: "people-outline",
    path: "/(tabs)/profile",
  },
];

type GlassHubActionProps = {
  id: string;
  title: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  selected?: boolean;
  sos?: boolean;
  onPress: () => void;
};

function GlassHubAction({
  id,
  title,
  icon,
  selected = false,
  sos = false,
  onPress,
}: GlassHubActionProps) {
  const textColor = sos || selected ? "#FFFFFF" : "rgba(29, 29, 31, 0.72)";
  const iconColor = sos || selected ? "#FFFFFF" : "rgba(29, 29, 31, 0.58)";

  return (
    <GlassView
      nativeID={`wildergo-glass-effect-${id}`}
      glassEffectStyle={{ style: "regular", animate: true, animationDuration: 0.22 }}
      tintColor={sos ? SOS_CRIMSON : selected ? "rgba(47, 111, 78, 0.82)" : "rgba(255, 255, 255, 0.62)"}
      isInteractive
      colorScheme="light"
      style={[styles.glassAction, sos && styles.sosGlassAction]}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.78}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessible={true}
        accessibilityLabel={sos ? "SOS Emergency Button" : `${title} tab`}
        accessibilityRole={sos ? "button" : "tab"}
        accessibilityState={sos ? undefined : { selected }}
        style={styles.glassActionPressable}
      >
        <Ionicons name={icon} size={sos ? 21 : 20} color={iconColor} />
        <Text
          style={[styles.glassActionText, { color: textColor }, sos && styles.sosText]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.82}
        >
          {sos ? "SOS" : title}
        </Text>
      </TouchableOpacity>
    </GlassView>
  );
}

function LiquidGlassBottomHub() {
  const pathname = usePathname();
  const router = useRouter();
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [demoModeEnabled, setDemoModeEnabled] = useState(false);
  const [glassAvailable] = useState(() => isGlassEffectAPIAvailable());

  const activeKey =
    TAB_ROUTES.find((route) => pathname.includes(route.key))?.key || "discovery";

  const handleTabPress = useCallback(
    (path: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push(path as any);
    },
    [router],
  );

  const handleSOS = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setShowSOSModal(true);
  }, []);

  return (
    <View pointerEvents="box-none" style={styles.hubLayer}>
      <GlassContainer
        nativeID="wildergo-global-glass-effect-container"
        spacing={18}
        style={styles.glassHubContainer}
      >
        {!glassAvailable ? (
          <BlurView intensity={88} tint="light" style={styles.glassFallback} />
        ) : null}

        <View style={styles.glassHubContent}>
          <View style={styles.destinationCluster}>
            {TAB_ROUTES.map((tab) => (
              <GlassHubAction
                key={tab.key}
                id={`tab-${tab.key}`}
                title={tab.title}
                icon={tab.icon}
                selected={activeKey === tab.key}
                onPress={() => handleTabPress(tab.path)}
              />
            ))}
          </View>

          <GlassHubAction
            id="sos-emergency"
            title="SOS"
            icon="alert-circle"
            sos
            onPress={handleSOS}
          />
        </View>
      </GlassContainer>

      <Modal transparent visible={showSOSModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
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
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen name="discovery" options={{ title: "Explore" }} />
        <Tabs.Screen name="map" options={{ title: "Map" }} />
        <Tabs.Screen name="messages" options={{ title: "Chat" }} />
        <Tabs.Screen name="profile" options={{ title: "Community" }} />
        <Tabs.Screen name="help" options={{ title: "Help" }} />
      </Tabs>
      <LiquidGlassBottomHub />
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
  hubLayer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: "center",
    zIndex: 2147483647,
    elevation: 2147483647,
  },
  glassHubContainer: {
    width: "94%",
    minHeight: 76,
    borderRadius: 999,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 24,
  },
  glassFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
  },
  glassHubContent: {
    flex: 1,
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 10,
  },
  destinationCluster: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 7,
  },
  glassAction: {
    minWidth: 54,
    height: 54,
    borderRadius: 999,
    overflow: "hidden",
  },
  sosGlassAction: {
    minWidth: 78,
  },
  glassActionPressable: {
    flex: 1,
    minWidth: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 10,
  },
  glassActionText: {
    maxWidth: 76,
    fontSize: 12,
    fontWeight: "700",
  },
  sosText: {
    fontSize: 13,
    letterSpacing: 0.4,
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
