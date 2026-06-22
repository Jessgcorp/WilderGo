import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "@/constants/theme";
import {
  getDetailedForecast,
  getWeatherIconName,
  getWindDirection,
  DetailedForecastData,
  HourlyForecast,
  ForecastDay,
} from "@/services/weather/weatherService";

interface WeatherDetailModalProps {
  visible: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
}

const screenHeight = Dimensions.get("window").height;

const WeatherDetailModal: React.FC<WeatherDetailModalProps> = ({
  visible,
  onClose,
  latitude,
  longitude,
}) => {
  const [internalVisible, setInternalVisible] = useState(visible);
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState<DetailedForecastData | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  const fetchDetailedForecast = React.useCallback(async () => {
    setLoading(true);
    const data = await getDetailedForecast(latitude, longitude);
    setForecast(data);
    setLoading(false);
  }, [latitude, longitude]);

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
      fetchDetailedForecast();
      return;
    }

    if (!visible && internalVisible && !isClosing) {
      setIsClosing(true);
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 180,
        useNativeDriver: true,
      }).start(() => {
        setInternalVisible(false);
        setIsClosing(false);
      });
    }
  }, [visible, internalVisible, isClosing, translateY, fetchDetailedForecast]);

  const closeWithAnimation = (callback?: () => void) => {
    if (isClosing) return;
    setIsClosing(true);
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setInternalVisible(false);
      setIsClosing(false);
      callback?.();
    });
  };

  const handleClose = () => {
    closeWithAnimation(onClose);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10 && gestureState.dy > 0;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120 || gestureState.vy > 0.8) {
          closeWithAnimation(onClose);
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            bounciness: 8,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateY, {
          toValue: 0,
          bounciness: 8,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  const renderCurrentWeather = () => {
    if (!forecast?.current) return null;
    const { current, locationName } = forecast;

    return (
      <View style={styles.currentSection}>
        <Text style={styles.locationName}>{locationName}</Text>
        <View style={styles.currentMain}>
          <Feather
            name={getWeatherIconName(current.icon || "01d") as any}
            size={80}
            color={colors.text.inverse}
            style={styles.currentIcon}
          />
          <Text style={styles.currentTemp}>{current.temperature}°</Text>
        </View>
        <Text style={styles.currentCondition}>{current.description}</Text>
        <View style={styles.currentDetails}>
          <View style={styles.detailItem}>
            <Feather name="droplet" size={16} color={colors.text.secondary} />
            <Text style={styles.detailText}>{current.humidity}%</Text>
          </View>
          <View style={styles.detailItem}>
            <Feather name="wind" size={16} color={colors.text.secondary} />
            <Text style={styles.detailText}>
              {current.windSpeed} mph {current.windDirection ? getWindDirection(current.windDirection) : ""}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Feather name="eye" size={16} color={colors.text.secondary} />
            <Text style={styles.detailText}>
              {current.visibility ? `${Math.round(current.visibility / 1609)} mi` : "--"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderHourlyForecast = () => {
    if (!forecast?.hourly) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hourly Forecast</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyScroll}>
          {forecast.hourly.map((hour: HourlyForecast, index: number) => (
            <View key={index} style={styles.hourlyItem}>
              <Text style={styles.hourlyTime}>{hour.time}</Text>
              <Feather name={getWeatherIconName(hour.icon) as any} size={28} color={colors.text.inverse} />
              <Text style={styles.hourlyTemp}>{hour.temperature}°</Text>
              <View style={styles.hourlyPrecip}>
                <Feather name="droplet" size={10} color={colors.moss[500]} />
                <Text style={styles.hourlyPrecipText}>{hour.precipitation}%</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderDailyForecast = () => {
    if (!forecast?.daily) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5-Day Forecast</Text>
        {forecast.daily.map((day: ForecastDay, index: number) => (
          <View key={index} style={styles.dailyItem}>
            <Text style={styles.dailyDate}>{day.date}</Text>
            <Feather name={getWeatherIconName(day.icon) as any} size={28} color={colors.text.inverse} />
            <View style={styles.dailyCondition}>
              <Text style={styles.dailyConditionText} numberOfLines={1}>{day.condition}</Text>
            </View>
            <View style={styles.dailyTemps}>
              <Text style={styles.dailyHigh}>{day.tempMax}°</Text>
              <View style={styles.tempBar}>
                <View style={[styles.tempBarFill, { width: `${Math.min(100, Math.max(0, (day.tempMax || 0) / 100 * 100))}%` }]} />
              </View>
              <Text style={styles.dailyLow}>{day.tempMin}°</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  if (!internalVisible) {
    return null;
  }

  return (
    <Modal transparent visible={internalVisible} animationType="none" onRequestClose={handleClose}>
      <View style={styles.overlay} pointerEvents={internalVisible ? "auto" : "none"}>
        <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
          <Animated.View style={[styles.modalContent, { transform: [{ translateY }] }]} {...panResponder.panHandlers}>
            <View style={styles.header}>
              <View style={styles.handle} />
              <TouchableOpacity onPress={handleClose} style={styles.closeButton} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Close weather modal">
                <Feather name="x" size={22} color={colors.text.inverse} />
              </TouchableOpacity>
            </View>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.moss[500]} />
                <Text style={styles.loadingText}>Loading weather data...</Text>
              </View>
            ) : forecast?.success ? (
              <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {renderCurrentWeather()}
                {renderHourlyForecast()}
                {renderDailyForecast()}
              </ScrollView>
            ) : (
              <View style={styles.errorContainer}>
                <Feather name="cloud-off" size={48} color={colors.text.secondary} />
                <Text style={styles.errorText}>Unable to load weather data</Text>
                <Pressable onPress={fetchDetailedForecast} style={styles.retryButton}>
                  <Text style={styles.retryText}>Try Again</Text>
                </Pressable>
              </View>
            )}
          </Animated.View>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
  },
  blurContainer: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    overflow: "hidden",
    maxHeight: "85%",
  },
  modalContent: {
    backgroundColor: "rgba(30, 35, 30, 0.96)",
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    minHeight: 420,
  },
  header: {
    alignItems: "center",
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    position: "relative",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
  },
  closeButton: {
    position: "absolute",
    right: spacing.lg,
    top: spacing.md,
    padding: spacing.sm,
    borderRadius: borderRadius.full,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.text.secondary,
    fontSize: typography.fontSize.md,
  },
  errorContainer: {
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
  },
  errorText: {
    marginTop: spacing.md,
    color: colors.text.secondary,
    fontSize: typography.fontSize.md,
  },
  retryButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.moss[500],
    borderRadius: borderRadius.md,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: typography.fontSize.md,
  },
  currentSection: {
    alignItems: "center",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  locationName: {
    fontSize: typography.fontSize.xl,
    fontWeight: "600",
    color: colors.text.inverse,
    marginBottom: spacing.sm,
  },
  currentMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  currentIcon: {
    width: 80,
    height: 80,
  },
  currentTemp: {
    fontSize: 72,
    fontWeight: "200",
    color: colors.text.inverse,
    marginLeft: -spacing.sm,
  },
  currentCondition: {
    fontSize: typography.fontSize.lg,
    color: "rgba(255, 255, 255, 0.7)",
    textTransform: "capitalize",
    marginTop: spacing.xs,
  },
  currentDetails: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xl,
    marginTop: spacing.lg,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  detailText: {
    fontSize: typography.fontSize.sm,
    color: "rgba(255, 255, 255, 0.72)",
  },
  section: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.65)",
    marginBottom: spacing.md,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  hourlyScroll: {
    paddingRight: spacing.lg,
  },
  hourlyItem: {
    alignItems: "center",
    marginRight: spacing.lg,
    minWidth: 64,
  },
  hourlyTime: {
    fontSize: typography.fontSize.sm,
    color: "rgba(255, 255, 255, 0.65)",
    marginBottom: spacing.xs,
  },
  hourlyTemp: {
    fontSize: typography.fontSize.md,
    fontWeight: "600",
    color: colors.text.inverse,
    marginTop: spacing.xs,
  },
  hourlyPrecip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: spacing.xs,
  },
  hourlyPrecipText: {
    fontSize: typography.fontSize.xs,
    color: colors.moss[400],
  },
  dailyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  dailyDate: {
    flex: 1.2,
    fontSize: typography.fontSize.md,
    color: colors.text.inverse,
  },
  dailyCondition: {
    flex: 1,
  },
  dailyConditionText: {
    fontSize: typography.fontSize.sm,
    color: "rgba(255, 255, 255, 0.65)",
    textTransform: "capitalize",
  },
  dailyTemps: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.sm,
  },
  dailyHigh: {
    fontSize: typography.fontSize.md,
    fontWeight: "600",
    color: colors.text.inverse,
    width: 30,
    textAlign: "right",
  },
  dailyLow: {
    fontSize: typography.fontSize.md,
    color: "rgba(255, 255, 255, 0.65)",
    width: 30,
    textAlign: "left",
  },
  tempBar: {
    width: 50,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  tempBarFill: {
    height: "100%",
    backgroundColor: colors.ember[400],
    borderRadius: 2,
  },
});

export default WeatherDetailModal;
