import React, { useMemo, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { colors } from "@/constants/theme";

const DEFAULT_TIPS = [
  "Stuck in sand? Rock under the tires helps build traction.",
  "Low on fuel? Drive with the windows down at low speed to conserve power.",
  "Keep a small shovel and recovery straps within easy reach.",
  "If your rig stalls, signal other drivers with hazard lights and flares.",
  "Always place a boulder or rock under the tire tread for traction when you get stuck.",
  "A quick mirror check before reversing can prevent campsite mishaps.",
];

export default function HelpScreen() {
  const [tipText, setTipText] = useState("");
  const [submittedTips, setSubmittedTips] = useState<string[]>([]);

  const tipList = useMemo(
    () => [...DEFAULT_TIPS, ...submittedTips],
    [submittedTips],
  );

  const handleSubmitTip = () => {
    if (!tipText.trim()) {
      Alert.alert("Add a tip", "Please write a quick tip before submitting.");
      return;
    }

    setSubmittedTips((current) => [tipText.trim(), ...current]);
    setTipText("");
    Alert.alert("Tip sent", "Your tip has been added to the community board.");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Pro Tips</Text>
        <Text style={styles.subheader}>
          Learn from the WilderGo community with practical recovery, safety, and
          route planning tips.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Community Safety Tips</Text>
          {tipList.map((tip, index) => (
            <View key={`${tip}-${index}`} style={styles.tipCard}>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}

          <TextInput
            style={styles.input}
            placeholder="Share your tip with the community..."
            placeholderTextColor="rgba(60, 60, 67, 0.5)"
            value={tipText}
            onChangeText={setTipText}
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmitTip}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Submit Tip</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text.primary,
    marginBottom: 10,
  },
  subheader: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
    marginBottom: 22,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text.primary,
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: "#F6F4EF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.primary,
  },
  input: {
    backgroundColor: "#F7F5EE",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(60, 60, 67, 0.12)",
    padding: 16,
    marginTop: 18,
    color: colors.text.primary,
    textAlignVertical: "top",
    minHeight: 96,
  },
  button: {
    marginTop: 16,
    backgroundColor: colors.ember[500],
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: colors.text.inverse,
    fontSize: 15,
    fontWeight: "700",
  },
});
