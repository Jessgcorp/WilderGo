/**
 * WilderGo Logo Component
 * Uses Russo One font for rugged, expedition-ready branding
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing } from "@/constants/theme";

interface LogoProps {
  size?: "small" | "medium" | "large" | "hero";
  variant?: "light" | "dark";
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = "medium",
  variant = "light",
  showTagline = false,
}) => {
  const getFontSize = () => {
    switch (size) {
      case "small":
        return 20;
      case "medium":
        return 28;
      case "large":
        return 36;
      case "hero":
        return 48;
    }
  };

  const getTaglineSize = () => {
    switch (size) {
      case "small":
        return 14;
      case "medium":
        return 18;
      case "large":
        return 24;
      case "hero":
        return 32;
    }
  };

  const textColor =
    variant === "light" ? colors.text.inverse : colors.bark[900];
  const accentColor = colors.ember[500];

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.logoText,
          {
            fontSize: getFontSize(),
            color: textColor,
          },
        ]}
      >
        Wilder
        <Text style={{ color: textColor }}>Go</Text>
      </Text>
      {showTagline && (
        <Text
          style={[
            styles.tagline,
            {
              fontSize: getTaglineSize(),
              color: variant === "light" ? colors.text.inverse : colors.bark[800],
            },
          ]}
        >
          Find Your Road Family
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  logoText: {
    fontFamily: typography.fontFamily.heading,
    letterSpacing: typography.letterSpacing.logo,
    textTransform: "uppercase",
  },
  tagline: {
    fontFamily: typography.fontFamily.bodySemiBold,
    marginTop: spacing.sm,
    letterSpacing: typography.letterSpacing.wide,
    fontStyle: "italic",
    lineHeight: 40,
  },
});

export default Logo;
