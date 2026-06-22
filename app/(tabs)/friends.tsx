import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

const mockFriends = [
  {
    id: "friend-1",
    name: "Mia Rivera",
    status: "Nearby campfire — 4 miles away",
    interests: "Hiking, van conversions, rooftop views",
    icon: "people-outline" as const,
  },
  {
    id: "friend-2",
    name: "Noah Walker",
    status: "On the road to Moab",
    interests: "Off-road routes, sunrise spots",
    icon: "trail-sign" as const,
  },
  {
    id: "friend-3",
    name: "Jun Park",
    status: "Connected — planning a meetup",
    interests: "Community meals, adventure routes",
    icon: "chatbubble-ellipses-outline" as const,
  },
];

export default function FriendsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Friends</Text>
        <Text style={styles.subheader}>
          Your road family is ready. View nearby connections, meetups, and quick
          social check-ins.
        </Text>

        {mockFriends.map((friend) => (
          <View key={friend.id} style={styles.friendCard}>
            <View style={styles.friendIcon}>
              <Ionicons name={friend.icon} size={22} color="#4A90E2" />
            </View>
            <View style={styles.friendDetails}>
              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={styles.friendStatus}>{friend.status}</Text>
              <Text style={styles.friendInterests}>{friend.interests}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.85}>
          <Text style={styles.actionButtonText}>Open Friends Map</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text.primary,
    marginBottom: 8,
  },
  subheader: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
    marginBottom: 20,
  },
  friendCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    elevation: 8,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  friendIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(74, 144, 226, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  friendStatus: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  friendInterests: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  actionButton: {
    marginTop: 8,
    backgroundColor: "#4A90E2",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
