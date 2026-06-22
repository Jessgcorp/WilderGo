import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ReportBugModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ReportBugModal({ visible, onClose }: ReportBugModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Ionicons name="bug" size={32} color="#FF3B30" />
            <Text style={styles.title}>Report a Bug</Text>
          </View>

          <Text style={styles.content}>
            Found something that's not working as expected?{"\n\n"}
            Send a detailed report to bugs@wildergo.com including:{"\n"}
            • What you were doing{"\n"}
            • What happened{"\n"}
            • Screenshots or videos{"\n\n"}
            We take all bug reports seriously and will investigate promptly.
          </Text>

          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
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
    width: "80%",
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
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: "#5A5A5A",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    backgroundColor: "#FF3B30",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
});
