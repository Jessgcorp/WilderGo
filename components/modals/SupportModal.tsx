import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type SupportModalType = "getting-started" | "faq" | "contact" | "bug" | null;

interface SupportModalProps {
  visible: boolean;
  type: SupportModalType;
  onClose: () => void;
}

export function SupportModal({ visible, type, onClose }: SupportModalProps) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (name.trim() && message.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setName("");
        setMessage("");
        setSubmitted(false);
        onClose();
      }, 2000);
    }
  };

  const renderContent = () => {
    switch (type) {
      case "getting-started":
        return (
          <ScrollView style={styles.contentScroll}>
            <Text style={styles.title}>Getting Started</Text>
            <Text style={styles.section}>📱 The Pill Navigation</Text>
            <Text style={styles.content}>
              The floating pill at the bottom of your screen contains 4 main tabs:
              {"\n\n"}
              • Explore (Compass) - Discover events and nomads
              {"\n"}
              • Map - View activities and friends on a map
              {"\n"}
              • Messages - Chat with other nomads
              {"\n"}
              • Profile - Your passport and settings
            </Text>

            <Text style={styles.section}>🟢 SOS Glow Indicator</Text>
            <Text style={styles.content}>
              The red SOS button shows your connectivity status:
              {"\n\n"}
              Green Border (Glowing) = You're online and connected
              {"\n"}
              No Border = You're offline or in limited signal area
              {"\n\n"}
              Tap it anytime to open emergency support options.
            </Text>

            <Text style={styles.section}>🎪 Finding Nomad Meetups</Text>
            <Text style={styles.content}>
              1. Tap the Explore (Compass) icon
              {"\n"}
              2. Scroll down to see "Nomad Meetups"
              {"\n"}
              3. Browse by activity type (hiking, fishing, etc.)
              {"\n"}
              4. Tap any event to join or message the host
            </Text>
          </ScrollView>
        );

      case "faq":
        return (
          <ScrollView style={styles.contentScroll}>
            <Text style={styles.title}>Frequently Asked Questions</Text>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>
                ❓ How do I use SOS if I'm offline?
              </Text>
              <Text style={styles.faqAnswer}>
                The SOS button still works offline! It attempts to send a distress signal via satellite or mesh network. Your location and emergency details are stored locally and sent when connectivity returns.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>
                ❓ How do I find meetups near me?
              </Text>
              <Text style={styles.faqAnswer}>
                Tap the Explore tab and scroll to "Nomad Meetups." Filter by activity type and date. You can also check the Map tab to see events visually on your location.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>
                ❓ Is my data private?
              </Text>
              <Text style={styles.faqAnswer}>
                Yes! WilderGo takes privacy seriously. You control what's public in your profile. Use "Ghost Mode" in settings to hide your location from other nomads. Emergency services always see your real location.
              </Text>
            </View>
          </ScrollView>
        );

      case "contact":
        return (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoid}
          >
            <ScrollView style={styles.contentScroll}>
              <Text style={styles.title}>Contact Support</Text>
              <Text style={styles.subtitle}>
                Have a question? Fill out the form below and we'll get back to you within 24 hours.
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Your Name"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                value={name}
                onChangeText={setName}
              />

              <TextInput
                style={[styles.input, styles.messageInput]}
                placeholder="Your Message"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              {submitted ? (
                <View style={styles.successMessage}>
                  <Ionicons name="checkmark-circle" size={40} color="#34C759" />
                  <Text style={styles.successText}>Message sent!</Text>
                  <Text style={styles.successSubtext}>
                    We'll respond within 24 hours
                  </Text>
                </View>
              ) : (
                <>
                  <Pressable
                    style={[
                      styles.submitButton,
                      !(name.trim() && message.trim()) && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={!(name.trim() && message.trim())}
                  >
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </Pressable>

                  <Text style={styles.altContact}>
                    Or email us: support@wildergo.com
                  </Text>
                </>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        );

      case "bug":
        return (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoid}
          >
            <ScrollView style={styles.contentScroll}>
              <Text style={styles.title}>Report a Bug</Text>
              <Text style={styles.subtitle}>
                Help us improve! Tell us what went wrong so we can fix it.
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Your Name"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                value={name}
                onChangeText={setName}
              />

              <TextInput
                style={[styles.input, styles.messageInput]}
                placeholder="Describe the bug (what happened, when, what did you expect?)"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />

              {submitted ? (
                <View style={styles.successMessage}>
                  <Ionicons name="checkmark-circle" size={40} color="#34C759" />
                  <Text style={styles.successText}>Bug report sent!</Text>
                  <Text style={styles.successSubtext}>
                    Our team will investigate and fix it
                  </Text>
                </View>
              ) : (
                <>
                  <Pressable
                    style={[
                      styles.submitButton,
                      !(name.trim() && message.trim()) && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={!(name.trim() && message.trim())}
                  >
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </Pressable>

                  <Text style={styles.altContact}>
                    Or email us: support@wildergo.com
                  </Text>
                </>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        );

      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={24} color="#1d1d1f" />
          </Pressable>
          <Text style={styles.headerTitle}>WilderGo</Text>
          <View style={{ width: 24 }} />
        </View>

        {renderContent()}

        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1d1d1f",
  },
  contentScroll: {
    flex: 1,
    padding: 20,
  },
  keyboardAvoid: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1d1d1f",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#5A5A5A",
    marginBottom: 20,
  },
  section: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1d1d1f",
    marginTop: 18,
    marginBottom: 10,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: "#5A5A5A",
    marginBottom: 12,
  },
  faqItem: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.08)",
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1d1d1f",
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 15,
    lineHeight: 22,
    color: "#5A5A5A",
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 15,
    color: "#1d1d1f",
    backgroundColor: "#F7F7F7",
  },
  messageInput: {
    minHeight: 100,
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: "#34C759",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  submitButtonDisabled: {
    backgroundColor: "rgba(52, 199, 89, 0.5)",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  altContact: {
    fontSize: 14,
    color: "#5A5A5A",
    textAlign: "center",
    marginBottom: 20,
  },
  successMessage: {
    alignItems: "center",
    paddingVertical: 40,
  },
  successText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1d1d1f",
    marginTop: 12,
  },
  successSubtext: {
    fontSize: 14,
    color: "#5A5A5A",
    marginTop: 4,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
});
