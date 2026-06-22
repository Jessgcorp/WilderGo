import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextStyle,
  ViewStyle,
  ImageStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, borderRadius } from "@/constants/theme";

const modeOptions = [
  {
    id: "friends",
    label: "Friends Mode",
    subtitle: "Connect with local nomads",
  },
  {
    id: "builder",
    label: "Builder Mode",
    subtitle: "Find trusted rig help",
  },
] as const;

const nomadProfiles = [
  {
    id: "nomad-1",
    name: "Riley",
    location: "Taos, NM",
    status: "Camping nearby",
    bio: "Trail guide. Campfire chef. Loves sunrise hikes.",
    imageUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60",
  },
  {
    id: "nomad-2",
    name: "Jules",
    location: "Sedona, AZ",
    status: "Gear swap host",
    bio: "Van life storyteller with rig tips and local routes.",
    imageUrl:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=60",
  },
  {
    id: "nomad-3",
    name: "Maya",
    location: "Moab, UT",
    status: "Meetup leader",
    bio: "Climber, navigator, first-aid trainer for adventure crews.",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=60",
  },
];

const meetupEvents = [
  {
    id: "meetup-1",
    date: "May 30, 2026",
    title: "Desert Warm-Up Camp",
    location: "Moab, UT",
    description: "Evening gear chat, campfire meet & greet, trail planning.",
  },
  {
    id: "meetup-2",
    date: "June 2, 2026",
    title: "Ridge Hike Crew",
    location: "San Juan Mountains, CO",
    description: "16-mile ridgeline hike with picnic and convoy stories.",
  },
  {
    id: "meetup-3",
    date: "June 5, 2026",
    title: "Riverfront Nomad Social",
    location: "Bend, OR",
    description: "Kayak launch, food truck lunch, and van walkthroughs.",
  },
  {
    id: "meetup-4",
    date: "June 8, 2026",
    title: "Camp Kitchen Swap",
    location: "Flagstaff, AZ",
    description: "Shared meals, camp kitchen hacks, outdoor cooking demos.",
  },
];

const nearbyActivities = [
  {
    id: "activity-1",
    date: "May 31, 2026",
    title: "Sunrise Trail Run",
    location: "Oak Creek Canyon, AZ",
  },
  {
    id: "activity-2",
    date: "June 4, 2026",
    title: "Ranger Talk & Gear Swap",
    location: "Flagstaff, AZ",
  },
  {
    id: "activity-3",
    date: "June 7, 2026",
    title: "Moonlight Stargaze",
    location: "Canyonlands, UT",
  },
];

export default function DiscoveryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<"friends" | "builder">("friends");

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Explore</Text>
      {/* intro paragraph intentionally removed per design */}

      <View style={styles.modesRow}>
        {modeOptions.map((mode) => (
          <Pressable
            key={mode.id}
            onPress={() => setSelectedMode(mode.id)}
            style={[
              styles.modeButton,
              selectedMode === mode.id && styles.modeButtonSelected,
            ]}
          >
            <Text
              style={[
                styles.modeLabel,
                selectedMode === mode.id && styles.modeLabelSelected,
              ]}
            >
              {mode.label}
            </Text>
            <Text style={styles.modeSubtitle}>{mode.subtitle}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nomad Profiles</Text>
          <Text style={styles.sectionSubTitle}>Scroll through verified travelers nearby.</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.profilesScroll}
        >
          {nomadProfiles.map((profile) => (
            <Pressable
              key={profile.id}
              style={styles.profileCard}
              onPress={() => router.push(`/profile/${profile.id}` as any)}
              accessibilityRole="link"
            >
              <Image source={{ uri: profile.imageUrl }} style={styles.profileImage} />
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileLocation}>{profile.location}</Text>
              <Text style={styles.profileStatus}>{profile.status}</Text>
              <Text style={styles.profileBio}>{profile.bio}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nomad Meetups</Text>
          <Text style={styles.sectionDateRange}>May 30 – June 8, 2026</Text>
        </View>

        {meetupEvents.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <Text style={styles.eventDate}>{event.date}</Text>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventLocation}>{event.location}</Text>
            <Text style={styles.eventDescription}>{event.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Activities</Text>
          <Text style={styles.sectionSubTitle}>
            Small-group adventures and community meetups near your route.
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activitiesScroll}
        >
          {nearbyActivities.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <Text style={styles.activityDate}>{activity.date}</Text>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityLocation}>{activity.location}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

type DiscoveryStyles = {
  container: ViewStyle;
  contentContainer: ViewStyle;
  heading: TextStyle;
  subheading: TextStyle;
  modesRow: ViewStyle;
  modeButton: ViewStyle;
  modeButtonSelected: ViewStyle;
  modeLabel: TextStyle;
  modeLabelSelected: TextStyle;
  modeSubtitle: TextStyle;
  section: ViewStyle;
  sectionHeader: ViewStyle;
  sectionTitle: TextStyle;
  sectionSubTitle: TextStyle;
  sectionDateRange: TextStyle;
  profilesScroll: ViewStyle;
  profileCard: ViewStyle;
  profileImage: ImageStyle;
  profileName: TextStyle;
  profileLocation: TextStyle;
  profileStatus: TextStyle;
  profileBio: TextStyle;
  eventCard: ViewStyle;
  eventDate: TextStyle;
  eventTitle: TextStyle;
  eventLocation: TextStyle;
  eventDescription: TextStyle;
  activitiesScroll: ViewStyle;
  activityCard: ViewStyle;
  activityDate: TextStyle;
  activityTitle: TextStyle;
  activityLocation: TextStyle;
};

const styles = StyleSheet.create<DiscoveryStyles>({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.bark[900],
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  subheading: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.bark[600],
    marginBottom: spacing.lg,
  },
  modesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  modeButton: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.background.primary,
  },
  modeButtonSelected: {
    backgroundColor: colors.bark[900],
    borderColor: colors.bark[900],
  },
  modeLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.bark[900],
    marginBottom: spacing.xs,
  },
  modeLabelSelected: {
    color: colors.background.primary,
  },
  modeSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.bark[600],
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.bark[900],
    marginBottom: spacing.xs,
  },
  sectionSubTitle: {
    fontSize: 13,
    color: colors.bark[600],
    lineHeight: 18,
  },
  sectionDateRange: {
    fontSize: 13,
    color: colors.moss[700],
    fontWeight: "700",
  },
  profilesScroll: {
    paddingBottom: spacing.sm,
  },
  profileCard: {
    width: 220,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.background.primary,
  },
  profileImage: {
    width: "100%",
    height: 124,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  profileName: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.bark[900],
    marginBottom: spacing.xs,
  },
  profileLocation: {
    fontSize: 13,
    color: colors.bark[600],
    marginBottom: spacing.xs,
  },
  profileStatus: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.moss[700],
    marginBottom: spacing.xs,
  },
  profileBio: {
    fontSize: 13,
    color: colors.bark[700],
    lineHeight: 18,
  },
  eventCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.background.primary,
  },
  eventDate: {
    fontSize: 13,
    color: colors.moss[700],
    marginBottom: spacing.xs,
    fontWeight: "700",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.bark[900],
    marginBottom: spacing.xs,
  },
  eventLocation: {
    fontSize: 13,
    color: colors.bark[600],
    marginBottom: spacing.sm,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.bark[700],
  },
  activitiesScroll: {
    paddingBottom: spacing.sm,
  },
  activityCard: {
    width: 200,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.background.primary,
  },
  activityDate: {
    fontSize: 12,
    color: colors.moss[700],
    marginBottom: spacing.xs,
    fontWeight: "700",
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.bark[900],
    marginBottom: spacing.xs,
  },
  activityLocation: {
    fontSize: 13,
    color: colors.bark[600],
  },
});
