import React, { useState } from "react";
// Force-saved by GitHub Copilot on 2026-06-03 to trigger metro reload
import {
  ImageBackground,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MeetupDetailModal from "./MeetupDetailModal";

type MeetupCard = {
  id: string;
  title: string;
  location: string;
  category: "Backpacking" | "MTB" | "Ski" | "Snowboards";
  activity: string;
  difficulty: string;
  temperature: string;
  host: string;
  spotsText: string;
  spotsFilled: number;
  spotsTotal: number;
  date: string;
  image: string;
  conditions?: string;
  description?: string;
  schedule?: Array<{ time: string; label: string }>;
};

type NomadProfile = {
  id: string;
  name: string;
  title: string;
  patches: number;
  nights: number;
  years: number;
  image: string;
};

const nomadProfiles: NomadProfile[] = [
  {
    id: "nomad-1",
    name: "Trail Wanderer",
    title: "The Dust Runner",
    patches: 12,
    nights: 47,
    years: 2,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=60",
  },
];

const categoryFilters = ["All", "Backpacking", "MTB", "Ski", "Snowboards", "Hiking"];

const meetupCards: MeetupCard[] = [
  {
    id: "meetup-1",
    title: "Backpacking Trip",
    location: "Wilderness, CO",
    category: "Backpacking",
    activity: "Backpacking",
    difficulty: "INTERMEDIATE",
    temperature: "58°",
    host: "Alex",
    spotsText: "2/5 spots filled",
    spotsFilled: 2,
    spotsTotal: 5,
    date: "Feb 15, 2026",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=60",
    conditions: "Bad",
    description: "Pack overnight essentials and prepare for rugged terrain.",
    schedule: [
      { time: "7:00 AM", label: "Meetup" },
      { time: "8:30 AM", label: "Trailhead Start" },
      { time: "12:00 PM", label: "Lunch" },
    ],
  },
  {
    id: "meetup-2",
    title: "MTB Shuttle Day",
    location: "Durango, CO",
    category: "MTB",
    activity: "MTB",
    difficulty: "INTERMEDIATE",
    temperature: "52°",
    host: "Jake",
    spotsText: "2/5 spots filled",
    spotsFilled: 2,
    spotsTotal: 5,
    date: "Feb 15, 2026",
    image:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=60",
    conditions: "Good Conditions",
    description: "Ride the mountain shuttle loops with a small crew.",
    schedule: [
      { time: "8:00 AM", label: "Driver meet" },
      { time: "9:00 AM", label: "First run" },
      { time: "1:00 PM", label: "Afternoon laps" },
    ],
  },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeetup, setSelectedMeetup] = useState<MeetupCard | null>(meetupCards[0]);

  const filteredMeetups =
    selectedCategory === "All"
      ? meetupCards
      : meetupCards.filter((card) => card.category === selectedCategory);

  return (
    <ImageBackground
      source={require("../../assets/images/scenes/scene-redwood-forest.png")}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageSource}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={[styles.content, { paddingTop: insets.top }]}> 
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>
              <Text style={styles.titleWilder}>WILDER</Text>
              <Text style={styles.titleGo}>GO</Text>
            </Text>
            <Text style={styles.headerSubtitle}>Friends</Text>
          </View>
          <Pressable style={styles.settingsIcon}>
            <Ionicons name="settings" size={22} color="#A8E6C1" />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nomad Profiles</Text>
              <Text style={styles.sectionSubtitle}>Verified travelers nearby.</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.profileScroll}
            >
              {nomadProfiles.map((profile) => (
                <View key={profile.id} style={styles.profileHeroCard}>
                  <View style={styles.profileHeaderRow}>
                    <Image source={{ uri: profile.image }} style={styles.profileHeroImage} />
                    <View style={styles.profileMeta}>
                      <Text style={styles.profileHeroName}>{profile.name}</Text>
                      <Text style={styles.profileHeroTitle}>{profile.title}</Text>
                    </View>
                  </View>
                  <View style={styles.profileStatsRow}>
                    <View style={styles.profileStatItem}>
                      <Text style={styles.profileStatValue}>{profile.patches}</Text>
                      <Text style={styles.profileStatLabel}>Patches</Text>
                    </View>
                    <View style={styles.profileStatItem}>
                      <Text style={styles.profileStatValue}>{profile.nights}</Text>
                      <Text style={styles.profileStatLabel}>Nights out</Text>
                    </View>
                    <View style={styles.profileStatItem}>
                      <Text style={styles.profileStatValue}>{profile.years}</Text>
                      <Text style={styles.profileStatLabel}>Years</Text>
                    </View>
                  </View>
                  <View style={styles.profileBadgeRow}>
                    <View style={styles.profileBadge} />
                    <View style={styles.profileBadge} />
                    <View style={styles.profileBadge} />
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          <ImageBackground
            source={require("../../assets/images/scenes/scene-redwood-forest.png")}
            style={styles.meetupsBackground}
            imageStyle={styles.meetupsBackgroundImage}
            resizeMode="cover"
          >
            <View style={styles.meetupsOverlay} />
            <View style={styles.meetupsContent}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Nomad Meetups</Text>
                <Pressable style={styles.hostButton}>
                  <Ionicons name="add" size={18} color="#FFF" />
                  <Text style={styles.hostButtonText}>Host</Text>
                </Pressable>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
                contentContainerStyle={styles.categoriesContent}
              >
                {categoryFilters.map((category) => {
                  const iconName =
                    category === "Backpacking"
                      ? "walk"
                      : category === "MTB"
                      ? "bicycle"
                      : category === "Ski"
                      ? "snow"
                      : category === "Snowboards"
                      ? "snow-outline"
                      : category === "Hiking"
                      ? "walk-outline"
                      : "layers-outline";
                  return (
                    <Pressable
                      key={category}
                      onPress={() => setSelectedCategory(category)}
                      style={[
                        styles.categoryPill,
                        selectedCategory === category && styles.categoryPillActive,
                      ]}
                    >
                      <Ionicons
                        name={iconName as any}
                        size={14}
                        color={selectedCategory === category ? "#FFF" : "#C4D9C4"}
                        style={styles.categoryPillIcon}
                      />
                      <Text
                        style={[
                          styles.categoryPillText,
                          selectedCategory === category && styles.categoryPillTextActive,
                        ]}
                      >
                        {category}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <View style={styles.cardsContainer}>
                {filteredMeetups.map((card) => (
                  <Pressable
                    key={card.id}
                    style={({ pressed }) => [styles.meetupCard, pressed && styles.cardPressed]}
                    onPress={() => {
                      setSelectedMeetup(card);
                      setModalVisible(true);
                    }}
                  >
                    <ImageBackground
                      source={{ uri: card.image }}
                      style={styles.cardImageContainer}
                      imageStyle={styles.cardImage}
                    >
                      <View style={styles.cardBadgesRow}>
                        <View style={styles.difficultyBadge}>
                          <Text style={styles.difficultyText}>{card.difficulty}</Text>
                        </View>
                        <View style={styles.tempBadge}>
                          <Ionicons name="cloud-outline" size={14} color="#FFF" />
                          <Text style={styles.tempText}>{card.temperature}</Text>
                        </View>
                      </View>
                    </ImageBackground>
                    <View style={styles.cardContent}>
                      <View style={styles.cardHeaderRow}>
                        <Text style={styles.cardTitle}>{card.title}</Text>
                        <Text style={styles.spotText}>{card.spotsText}</Text>
                      </View>
                      <Text style={styles.cardBadgeLabel}>{card.activity}</Text>
                      <View style={styles.cardLocationRow}>
                        <Ionicons name="location-outline" size={13} color="#84A99F" />
                        <Text style={styles.cardLocation}>{card.location}</Text>
                      </View>
                      <View style={styles.cardDateRow}>
                        <Ionicons name="calendar-outline" size={13} color="#84A99F" />
                        <Text style={styles.cardDate}>{card.date}</Text>
                      </View>
                      <View style={styles.cellRow}>
                        <View style={styles.cellDot} />
                        <Text style={styles.cellText}>Cell: Good</Text>
                      </View>
                      {card.conditions ? (
                        <Text style={styles.conditionsText}>{card.conditions}</Text>
                      ) : null}
                      <View style={styles.hostRow}>
                        <Image
                          source={{
                            uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=60",
                          }}
                          style={styles.hostAvatar}
                        />
                        <Text style={styles.hostText}>Hosted by {card.host}</Text>
                      </View>
                      <View style={styles.progressRow}>
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressFill,
                              { width: `${Math.ceil((card.spotsFilled / card.spotsTotal) * 100)}%` },
                            ]}
                          />
                        </View>
                        <Text style={styles.progressLabel}>{card.spotsText}</Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          </ImageBackground>

          {selectedMeetup && (
            <MeetupDetailModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              meetup={selectedMeetup}
            />
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

type ExploreStyles = {
  backgroundImage: ViewStyle;
  backgroundImageSource: ImageStyle;
  overlay: ViewStyle;
  content: ViewStyle;
  header: ViewStyle;
  headerLeft: ViewStyle;
  headerTitle: TextStyle;
  titleWilder: TextStyle;
  titleGo: TextStyle;
  headerSubtitle: TextStyle;
  settingsIcon: ViewStyle;
  scrollView: ViewStyle;
  scrollContent: ViewStyle;
  section: ViewStyle;
  sectionHeader: ViewStyle;
  sectionTitle: TextStyle;
  sectionSubtitle: TextStyle;
  hostButton: ViewStyle;
  hostButtonText: TextStyle;
  categoriesScroll: ViewStyle;
  categoriesContent: ViewStyle;
  categoryPill: ViewStyle;
  categoryPillActive: ViewStyle;
  categoryPillIcon: TextStyle;
  categoryPillText: TextStyle;
  categoryPillTextActive: TextStyle;
  meetupsBackground: ViewStyle;
  meetupsBackgroundImage: ImageStyle;
  meetupsOverlay: ViewStyle;
  meetupsContent: ViewStyle;
  profileScroll: ViewStyle;
  profileHeroCard: ViewStyle;
  profileHeaderRow: ViewStyle;
  profileHeroImage: ImageStyle;
  profileMeta: ViewStyle;
  profileHeroName: TextStyle;
  profileHeroTitle: TextStyle;
  profileStatsRow: ViewStyle;
  profileStatItem: ViewStyle;
  profileStatValue: TextStyle;
  profileStatLabel: TextStyle;
  profileBadgeRow: ViewStyle;
  profileBadge: ViewStyle;
  cardsContainer: ViewStyle;
  meetupCard: ViewStyle;
  cardPressed: ViewStyle;
  cardImageContainer: ViewStyle;
  cardImage: ImageStyle;
  cardBadgesRow: ViewStyle;
  difficultyBadge: ViewStyle;
  difficultyText: TextStyle;
  tempBadge: ViewStyle;
  tempText: TextStyle;
  cardContent: ViewStyle;
  cardHeaderRow: ViewStyle;
  cardTitle: TextStyle;
  spotText: TextStyle;
  cardBadgeLabel: TextStyle;
  cardLocationRow: ViewStyle;
  cardLocation: TextStyle;
  cardDateRow: ViewStyle;
  cardDate: TextStyle;
  cellRow: ViewStyle;
  cellDot: ViewStyle;
  cellText: TextStyle;
  conditionsText: TextStyle;
  hostRow: ViewStyle;
  hostAvatar: ImageStyle;
  hostText: TextStyle;
  progressRow: ViewStyle;
  progressBar: ViewStyle;
  progressFill: ViewStyle;
  progressLabel: TextStyle;
};

const styles = StyleSheet.create<ExploreStyles>({
  backgroundImage: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImageSource: {
    opacity: 0.9,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(3, 12, 9, 0.45)",
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },
  headerLeft: {
    gap: 6,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  titleWilder: {
    color: "#FFF",
  },
  titleGo: {
    color: "#34C759",
  },
  headerSubtitle: {
    color: "#B8D3C5",
    fontSize: 12,
    fontWeight: "700",
  },
  settingsIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFF",
  },
  sectionSubtitle: {
    color: "#B8D3C5",
    fontSize: 13,
    marginBottom: 18,
    maxWidth: "85%",
  },
  hostButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#34C759",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  hostButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 13,
  },
  categoriesScroll: {
    marginBottom: 22,
  },
  categoriesContent: {
    gap: 10,
    paddingRight: 20,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  categoryPillActive: {
    backgroundColor: "rgba(52,199,89,0.16)",
    borderColor: "rgba(52,199,89,0.35)",
  },
  categoryPillIcon: {
    marginTop: 1,
  },
  categoryPillText: {
    color: "#C4D9C4",
    fontSize: 13,
    fontWeight: "700",
  },
  categoryPillTextActive: {
    color: "#FFF",
  },
  meetupsBackground: {
    marginHorizontal: 16,
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 24,
  },
  meetupsBackgroundImage: {
    opacity: 0.95,
  },
  meetupsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 14, 12, 0.32)",
  },
  meetupsContent: {
    padding: 20,
  },
  profileScroll: {
    paddingBottom: 18,
  },
  profileHeroCard: {
    width: 320,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 30,
    padding: 20,
    marginRight: 16,
  },
  profileHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 18,
  },
  profileHeroImage: {
    width: 72,
    height: 72,
    borderRadius: 20,
  },
  profileMeta: {
    flex: 1,
  },
  profileHeroName: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111",
  },
  profileHeroTitle: {
    fontSize: 13,
    color: "#5B5B5B",
    marginTop: 4,
  },
  profileStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  profileStatItem: {
    alignItems: "center",
  },
  profileStatValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#114D44",
  },
  profileStatLabel: {
    fontSize: 11,
    color: "#6B6B6B",
    marginTop: 2,
  },
  profileBadgeRow: {
    flexDirection: "row",
    gap: 10,
  },
  profileBadge: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "rgba(52,199,89,0.12)",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    gap: 12,
  },
  meetupCard: {
    width: "48%",
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "rgba(12, 19, 16, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 10,
    marginBottom: 16,
  },
  cardPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  cardImageContainer: {
    width: "100%",
    height: 154,
    justifyContent: "flex-end",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  cardBadgesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 14,
  },
  difficultyBadge: {
    backgroundColor: "rgba(255,107,53,0.95)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  difficultyText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "800",
  },
  tempBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(52,199,89,0.96)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tempText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
  },
  cardContent: {
    padding: 16,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 10,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "900",
    color: "#FFF",
    lineHeight: 20,
  },
  spotText: {
    fontSize: 11,
    color: "#B6D7C5",
    fontWeight: "700",
  },
  cardBadgeLabel: {
    fontSize: 12,
    color: "#9ED4AD",
    fontWeight: "700",
    marginBottom: 12,
  },
  cardLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  cardLocation: {
    color: "#B6D7C5",
    fontSize: 12,
  },
  cardDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  cardDate: {
    color: "#A3B8AB",
    fontSize: 12,
  },
  cellRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  cellDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#34C759",
  },
  cellText: {
    color: "#B6D7C5",
    fontSize: 12,
  },
  conditionsText: {
    color: "#34C759",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 12,
  },
  hostRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  hostAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  hostText: {
    color: "#DBE9DB",
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#34C759",
    borderRadius: 3,
  },
  progressLabel: {
    color: "#B6D7C5",
    fontSize: 11,
    fontWeight: "700",
  },
});
