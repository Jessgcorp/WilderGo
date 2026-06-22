import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "@/hooks/useRouterCompat";
import {
  BuilderProfileCard,
  BuilderCompactCard,
} from "@/components/profiles/BuilderProfileCard";
import { colors, typography, spacing, shadows } from "@/constants/theme";

const builderProfiles = [
  {
    id: "builder-1",
    businessName: "Desert Gear Works",
    name: "Avery",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=60",
    coverImageUrl:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=60",
    location: "Sedona, AZ",
    expertise: ["Solar", "Electrical", "Insulation"],
    rating: 5,
    reviewCount: 28,
    verified: true,
    consultationRate: 120,
    specialties: [
      { name: "Solar", icon: "sun" },
      { name: "Electrical", icon: "zap" },
      { name: "Insulation", icon: "layers" },
    ],
  },
  {
    id: "builder-2",
    businessName: "Canyon Custom Builds",
    name: "Jordan",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=60",
    location: "Moab, UT",
    expertise: ["Cabinetry", "Woodwork", "Design"],
    rating: 4,
    reviewCount: 18,
    verified: true,
    consultationRate: 100,
    specialties: [
      { name: "Woodwork", icon: "box" },
      { name: "Cabinetry", icon: "box" },
      { name: "Design", icon: "pen-tool" },
    ],
  },
  {
    id: "builder-3",
    businessName: "Trailhead Service Co.",
    name: "Sam",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=60",
    location: "Bend, OR",
    expertise: ["Plumbing", "HVAC", "Diesel Heaters"],
    rating: 5,
    reviewCount: 34,
    verified: true,
    consultationRate: 110,
    specialties: [
      { name: "Plumbing", icon: "droplet" },
      { name: "HVAC", icon: "thermometer" },
      { name: "Diesel Heaters", icon: "wind" },
    ],
  },
];

export default function BuildersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.headerWrapper}>
        {Platform.OS === "ios" ? (
          <BlurView
            intensity={80}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.bark[800]} />
          </TouchableOpacity>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>All Builders</Text>
            <Text style={styles.subtitle}>
              Browse the full verified builder directory.
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {builderProfiles.map((builder) => (
          <BuilderProfileCard
            key={builder.id}
            profile={builder}
            onViewPortfolio={() => router.push("/messages")}
            onBookConsult={() => router.push("/messages")}
            onMessage={() => router.push("/messages")}
          />
        ))}

        <Text style={styles.quickLabel}>Quick Connect</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickList}
        >
          {builderProfiles.map((builder) => (
            <BuilderCompactCard
              key={builder.id}
              profile={builder}
              onPress={() => router.push("/messages")}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerWrapper: {
    minHeight: 120,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    justifyContent: "flex-end",
    backgroundColor: colors.background.primary,
    ...shadows.glassSubtle,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.glass.whiteLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.heading,
    color: colors.bark[800],
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.body,
    color: colors.bark[500],
    marginTop: spacing.xs,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
  quickLabel: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bodySemiBold,
    color: colors.bark[800],
  },
  quickList: {
    paddingBottom: spacing.xl,
  },
});
