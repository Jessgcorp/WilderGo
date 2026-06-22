import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MeetupDetailModal from "./MeetupDetailModal";

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

const mockMeetups: MeetupCard[] = [
  {
    id: "1",
    title: "Backpacking Trip",
    location: "Indian Peaks, CO",
    category: "Trail",
    activity: "Hike",
    difficulty: "Moderate",
    temperature: "55F",
    host: "Avery Morgan",
    spotsText: "Full",
    spotsFilled: 6,
    spotsTotal: 6,
    date: "June 6, 2026",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    conditions: "Clear morning, light afternoon wind",
    description:
      "A steady alpine overnight with a relaxed pace, shared camp dinner, and an early sunrise hike.",
    schedule: [
      { time: "7:00 AM", label: "Meet at trailhead" },
      { time: "10:30 AM", label: "Lake overlook break" },
      { time: "3:00 PM", label: "Set camp" },
    ],
  },
  {
    id: "2",
    title: "MTB Shuttle Day",
    location: "Durango, CO",
    category: "Ride",
    activity: "Bicycle",
    difficulty: "Advanced",
    temperature: "61F",
    host: "Maya Chen",
    spotsText: "2/5 spots",
    spotsFilled: 2,
    spotsTotal: 5,
    date: "February 15, 2026",
    image:
      "https://images.unsplash.com/photo-1544191696-15693072e187?auto=format&fit=crop&w=1200&q=80",
    conditions: "Dry singletrack, mild temps",
    description:
      "A technical shuttle loop for confident riders with regroup points and post-ride food in town.",
    schedule: [
      { time: "8:30 AM", label: "Load bikes" },
      { time: "9:15 AM", label: "First descent" },
      { time: "1:00 PM", label: "Lunch stop" },
    ],
  },
];

export default function ExploreScreen() {
  const [selectedMeetup, setSelectedMeetup] = useState<MeetupCard | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openMeetup = (meetup: MeetupCard) => {
    setSelectedMeetup(meetup);
    setModalVisible(true);
  };

  const closeMeetup = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Nomad Meetups</Text>
        <View style={styles.cardsContainer}>
          {mockMeetups.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.meetupCard}
              activeOpacity={0.82}
              onPress={() => openMeetup(item)}
            >
              <Text style={styles.cardCategory}>{item.category}</Text>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.cardMeta} numberOfLines={2}>
                {item.location}
              </Text>
              <Text style={styles.cardDate}>{item.date}</Text>
              <Text style={styles.cardSlots}>{item.spotsText}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <MeetupDetailModal
        visible={modalVisible}
        onClose={closeMeetup}
        meetup={selectedMeetup}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 140,
    paddingBottom: 160,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  meetupCard: {
    width: "48%",
    minHeight: 150,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.55)",
  },
  cardCategory: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2F6F4E",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#263126",
  },
  cardMeta: {
    fontSize: 12,
    color: "#5E6A60",
    marginTop: 6,
  },
  cardDate: {
    fontSize: 11,
    color: "#5E6A60",
    marginTop: 10,
  },
  cardSlots: {
    fontSize: 11,
    color: "#D30429",
    marginTop: 8,
    fontWeight: "700",
  },
});
