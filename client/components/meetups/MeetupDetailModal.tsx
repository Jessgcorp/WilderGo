import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type MeetupCard = {
  id: string;
  title: string;
  location: string;
  category: string;
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

export default function MeetupDetailModal({
  meetup,
  onClose,
}: {
  meetup: MeetupCard;
  onClose: () => void;
}) {
  const [requested, setRequested] = useState(false);

  const hourly = [
    { t: "9AM", temp: "45°" },
    { t: "11AM", temp: "52°" },
    { t: "1PM", temp: "55°" },
    { t: "3PM", temp: "53°" },
    { t: "5PM", temp: "48°" },
  ];

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.topRibbonRow}>
              <View style={styles.ribbonLeft}>
                <View style={styles.activityPill}>
                  <Ionicons name="bicycle" size={14} color="#fff" />
                  <Text style={styles.activityText}>{meetup.activity}</Text>
                </View>
                <View style={styles.difficultyPill}>
                  <Text style={styles.difficultyText}>{meetup.difficulty}</Text>
                </View>
              </View>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={20} color="#FFF" />
              </Pressable>
            </View>

            <ImageBackground source={{ uri: meetup.image }} style={styles.hero}>
              <View style={styles.heroOverlay} />
            </ImageBackground>

            <View style={styles.contentWrap}>
              <Text style={styles.title}>{meetup.title}</Text>

              <View style={styles.hostCard}>
                <Image
                  source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=60" }}
                  style={styles.hostAvatar}
                />
                <View style={styles.hostMeta}>
                  <Text style={styles.hostLabel}>Hosted by</Text>
                  <Text style={styles.hostName}>{meetup.host}</Text>
                </View>
              </View>

              <View style={styles.metaGrid}>
                <View style={styles.metaItem}>
                  <Ionicons name="location-outline" size={16} color="#B6D7C5" />
                  <Text style={styles.metaText}>{meetup.location}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={16} color="#B6D7C5" />
                  <Text style={styles.metaText}>{meetup.date}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="people" size={16} color="#B6D7C5" />
                  <Text style={styles.metaText}>{meetup.spotsText}</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About This Adventure</Text>
                <Text style={styles.paragraph}>{meetup.description ?? "An awesome day outdoors with great people."}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Schedule</Text>
                {(meetup.schedule ?? [
                  { time: "7:00 AM", label: "Meetup" },
                  { time: "8:30 AM", label: "Trailhead Start" },
                  { time: "12:00 PM", label: "Lunch" },
                ]).map((item, index) => (
                  <View key={index} style={styles.scheduleRow}>
                    <View style={styles.scheduleDot} />
                    <Text style={styles.scheduleTime}>{item.time}</Text>
                    <Text style={styles.scheduleLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Weather Forecast</Text>
                <View style={styles.weatherCard}>
                  <View style={styles.weatherTopRow}>
                    <Ionicons name="partly-sunny" size={28} color="#F3A712" />
                    <View style={styles.weatherMeta}>
                      <Text style={styles.weatherTemp}>52°F</Text>
                      <Text style={styles.weatherState}>PartlyCloudy • Feels like 48°F</Text>
                    </View>
                    <View style={styles.weatherBadge}>
                      <Text style={styles.weatherBadgeText}>GOOD</Text>
                    </View>
                  </View>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyScroll} contentContainerStyle={styles.hourlyContent}>
                    {hourly.map((hour, index) => (
                      <View key={index} style={styles.hourCard}>
                        <Text style={styles.hourText}>{hour.t}</Text>
                        <Ionicons name="cloud-outline" size={18} color="#FFF" />
                        <Text style={styles.hourTemp}>{hour.temp}</Text>
                      </View>
                    ))}
                  </ScrollView>

                  <View style={styles.impactBox}>
                    <Text style={styles.impactText}>Trails may be slightly tacky - good grip</Text>
                    <Text style={styles.impactText}>Afternoon showers possible - pack rain gear</Text>
                    <Text style={styles.impactText}>Comfortable riding temps</Text>
                  </View>
                </View>
              </View>

              <View style={styles.footerSpacing} />
            </View>
          </ScrollView>

          <View style={styles.bottomActionBar}>
            {!requested ? (
              <Pressable style={styles.requestButton} onPress={() => setRequested(true)}>
                <Text style={styles.requestButtonText}>Request to Join</Text>
              </Pressable>
            ) : (
              <View style={styles.requestedStatus}>
                <Text style={styles.requestedTitle}>Requested ✓</Text>
                <Text style={styles.requestedSubtitle}>You will be notified when the host responds.</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    height: "92%",
    backgroundColor: "#111",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  scrollContent: {
    paddingBottom: 0,
  },
  topRibbonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 20,
  },
  ribbonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  activityPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#2E7D73",
    borderRadius: 18,
  },
  activityText: {
    color: "#FFF",
    marginLeft: 8,
    fontWeight: "800",
  },
  difficultyPill: {
    backgroundColor: "#F39C6B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyText: {
    color: "#FFF",
    fontWeight: "800",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  hero: {
    width: "100%",
    height: 220,
    justifyContent: "flex-end",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.22)",
  },
  contentWrap: {
    padding: 18,
  },
  title: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "900",
  },
  hostCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    gap: 14,
  },
  hostAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  hostMeta: {
    flex: 1,
  },
  hostLabel: {
    color: "#B6D7C5",
    fontSize: 12,
  },
  hostName: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },
  metaGrid: {
    marginTop: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  metaText: {
    color: "#B6D7C5",
  },
  section: {
    marginTop: 22,
  },
  sectionTitle: {
    color: "#FFF",
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 12,
  },
  paragraph: {
    color: "#C5C5C5",
    lineHeight: 22,
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  scheduleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#34C759",
    marginRight: 12,
  },
  scheduleTime: {
    color: "#FFF",
    fontWeight: "700",
    width: 90,
  },
  scheduleLabel: {
    color: "#C5C5C5",
  },
  weatherCard: {
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 18,
    padding: 16,
  },
  weatherTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  weatherMeta: {
    marginLeft: 12,
  },
  weatherTemp: {
    color: "#FFF",
    fontSize: 36,
    fontWeight: "900",
  },
  weatherState: {
    color: "#C5C5C5",
  },
  weatherBadge: {
    marginLeft: "auto",
    backgroundColor: "#34C759",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  weatherBadgeText: {
    color: "#fff",
    fontWeight: "800",
  },
  hourlyScroll: {
    marginTop: 14,
  },
  hourlyContent: {
    gap: 12,
    paddingRight: 16,
  },
  hourCard: {
    width: 78,
    height: 98,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  hourText: {
    color: "#C5C5C5",
    marginBottom: 8,
  },
  hourTemp: {
    color: "#FFF",
    marginTop: 8,
    fontWeight: "800",
  },
  impactBox: {
    marginTop: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 14,
  },
  impactText: {
    color: "#C5C5C5",
    marginBottom: 8,
  },
  footerSpacing: {
    height: 90,
  },
  bottomActionBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: "rgba(17,17,17,0.96)",
  },
  requestButton: {
    backgroundColor: "#34C759",
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
  },
  requestButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
  requestedStatus: {
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  requestedTitle: {
    color: "#FFF",
    fontWeight: "900",
    fontSize: 16,
  },
  requestedSubtitle: {
    color: "#C5C5C5",
    marginTop: 6,
    textAlign: "center",
  },
});
