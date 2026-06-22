import React from "react";
import { Modal, View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface GettingStartedModalProps {
  visible: boolean;
  onClose: () => void;
}

export function GettingStartedModal({ visible, onClose }: GettingStartedModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Ionicons name="information-circle" size={32} color="#007AFF" />
            <Text style={styles.title}>Getting Started</Text>
          </View>

          <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>1. Explore Nearby Events</Text>
            <Text style={styles.content}>
              Discover outdoor activities and meetups in your area. Find adventures tailored to your skill level.
            </Text>

            <Text style={styles.sectionTitle}>2. Browse the Map</Text>
            <Text style={styles.content}>
              View activities, builders, and other nomads on the interactive map. Filter by activity type.
            </Text>

            <Text style={styles.sectionTitle}>3. Connect with Others</Text>
            <Text style={styles.content}>
              Message nomads, book builder consultations, and join group activities. Build your road family!
            </Text>

            <Text style={styles.sectionTitle}>4. Stay Safe</Text>
            <Text style={styles.content}>
              Use the SOS button (red circle) in emergencies. It connects you to emergency services and support.
            </Text>
          </ScrollView>

          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Got It</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    maxHeight: "70%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1d1d1f",
    marginTop: 10,
  },
  contentScroll: {
    width: "100%",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1d1d1f",
    marginTop: 12,
    marginBottom: 6,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: "#5A5A5A",
    marginBottom: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
});
