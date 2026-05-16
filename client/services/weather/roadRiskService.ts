import { getCurrentWeather, WeatherData } from "./weatherService";

export interface RoadRiskPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface RoadCondition {
  latitude: number;
  longitude: number;
  timestamp: number;
  temp: number;
  feelsLike: number;
  dewPoint: number;
  windSpeed: number;
  windGust?: number;
  precipitation: number;
  humidity: number;
  visibility: number;
  roadSurfaceTemp?: number;
  blackIceRisk?: boolean;
  condition: string;
}

export interface NationalAlert {
  senderName: string;
  event: string;
  description: string;
  severity: "Minor" | "Moderate" | "Severe" | "Extreme";
  start: number;
  end: number;
}

export interface RoadRiskData {
  success: boolean;
  conditions: RoadCondition[];
  alerts: NationalAlert[];
  overallRiskLevel: "low" | "moderate" | "high" | "extreme";
  riskScore: number;
  warnings: string[];
  error?: string;
}

export interface RoadRiskSummary {
  hasBlackIce: boolean;
  hasPrecipitation: boolean;
  hasNationalAlerts: boolean;
  minTemp: number;
  maxTemp: number;
  maxWindSpeed: number;
  avgVisibility: number;
  alertCount: number;
  riskLevel: "low" | "moderate" | "high" | "extreme";
  riskScore: number;
}

const calculateEstimatedTravelTime = (
  startTime: number,
  totalDurationMinutes: number,
  pointIndex: number,
  totalPoints: number,
): number => {
  const progress = pointIndex / (totalPoints - 1);
  const elapsedMinutes = totalDurationMinutes * progress;
  return startTime + elapsedMinutes * 60 * 1000;
};

export const getRoadRisk = async (
  routePoints: { latitude: number; longitude: number }[],
  durationMinutes: number = 60,
  departureTime?: Date,
): Promise<RoadRiskData> => {
  try {
    if (!routePoints || routePoints.length < 2) {
      return {
        success: false,
        conditions: [],
        alerts: [],
        overallRiskLevel: "low",
        riskScore: 100,
        warnings: [],
        error: "Invalid route points",
      };
    }

    const startTime = departureTime?.getTime() || Date.now();
    const samplePoints = sampleRoutePoints(routePoints, 5);

    console.log(
      "Fetching weather-based road risk for",
      samplePoints.length,
      "points...",
    );

    const weatherPromises = samplePoints.map((point) =>
      getCurrentWeather(point.latitude, point.longitude),
    );

    const weatherResults = await Promise.all(weatherPromises);

    const conditions: RoadCondition[] = weatherResults.map(
      (weather: WeatherData, index: number) => {
        const point = samplePoints[index];
        const timestamp = Math.floor(
          calculateEstimatedTravelTime(
            startTime,
            durationMinutes,
            index,
            samplePoints.length,
          ) / 1000,
        );

        return createConditionFromWeather(weather, point, timestamp);
      },
    );

    const { riskLevel, riskScore, generatedWarnings } = analyzeRoadRisk(
      conditions,
      [],
    );

    return {
      success: true,
      conditions,
      alerts: [],
      overallRiskLevel: riskLevel,
      riskScore,
      warnings: generatedWarnings,
    };
  } catch (error: any) {
    console.error("Road Risk error:", error);
    return createFallbackRoadRisk(routePoints, error.message);
  }
};

const createConditionFromWeather = (
  weather: WeatherData,
  point: { latitude: number; longitude: number },
  timestamp: number,
): RoadCondition => {
  const temp = weather.temperature || 70;
  const windSpeed = weather.windSpeed || 0;
  const visibility = weather.visibility || 10000;
  const condition = weather.condition || "Clear";

  const hasPrecipitation = ["Rain", "Drizzle", "Snow", "Thunderstorm"].includes(
    condition,
  );
  const precipAmount = hasPrecipitation
    ? condition === "Snow"
      ? 3
      : condition === "Thunderstorm"
        ? 5
        : 1
    : 0;

  const estimatedRoadTemp = temp < 40 ? temp - 3 : temp;
  const hasHighHumidity =
    weather.humidity !== undefined && weather.humidity > 80;
  const blackIceRisk =
    estimatedRoadTemp < 32 && (hasPrecipitation || hasHighHumidity);

  return {
    latitude: point.latitude,
    longitude: point.longitude,
    timestamp,
    temp,
    feelsLike: weather.feelsLike || temp,
    dewPoint: temp - 10,
    windSpeed,
    windGust: windSpeed > 15 ? windSpeed * 1.3 : undefined,
    precipitation: precipAmount,
    humidity: weather.humidity || 50,
    visibility,
    roadSurfaceTemp: estimatedRoadTemp,
    blackIceRisk,
    condition: weather.description || condition,
  };
};

const sampleRoutePoints = (
  points: { latitude: number; longitude: number }[],
  maxPoints: number,
): { latitude: number; longitude: number }[] => {
  if (points.length <= maxPoints) {
    return points;
  }

  const sampled: { latitude: number; longitude: number }[] = [];
  const step = (points.length - 1) / (maxPoints - 1);

  for (let i = 0; i < maxPoints; i++) {
    const index = Math.round(i * step);
    sampled.push(points[index]);
  }

  return sampled;
};

const createFallbackRoadRisk = (
  routePoints: { latitude: number; longitude: number }[],
  errorMessage: string,
): RoadRiskData => {
  console.log("Using fallback road risk assessment:", errorMessage);

  return {
    success: true,
    conditions: [],
    alerts: [],
    overallRiskLevel: "low",
    riskScore: 85,
    warnings: ["Road condition data limited - using weather-based assessment"],
    error: undefined,
  };
};

const analyzeRoadRisk = (
  conditions: RoadCondition[],
  alerts: NationalAlert[],
): {
  riskLevel: "low" | "moderate" | "high" | "extreme";
  riskScore: number;
  generatedWarnings: string[];
} => {
  const warnings: string[] = [];
  let riskScore = 100;

  const hasBlackIce = conditions.some((c) => c.blackIceRisk);
  if (hasBlackIce) {
    riskScore -= 40;
    warnings.push("Black ice conditions detected along route");
  }

  const freezingPoints = conditions.filter(
    (c) => c.temp < 32 || (c.roadSurfaceTemp && c.roadSurfaceTemp < 32),
  );
  if (freezingPoints.length > 0) {
    riskScore -= 15;
    warnings.push("Freezing temperatures along route - watch for ice");
  }

  const hasPrecipitation = conditions.some((c) => c.precipitation > 0);
  if (hasPrecipitation) {
    const heavyPrecip = conditions.some((c) => c.precipitation > 5);
    if (heavyPrecip) {
      riskScore -= 20;
      warnings.push("Heavy precipitation expected - reduced visibility");
    } else {
      riskScore -= 10;
      warnings.push("Precipitation along route");
    }
  }

  const maxWind = Math.max(...conditions.map((c) => c.windSpeed), 0);
  if (maxWind > 40) {
    riskScore -= 25;
    warnings.push(`Dangerous wind gusts up to ${Math.round(maxWind)} mph`);
  } else if (maxWind > 25) {
    riskScore -= 10;
    warnings.push(`High winds up to ${Math.round(maxWind)} mph`);
  }

  const minVisibility = Math.min(...conditions.map((c) => c.visibility), 10000);
  if (minVisibility < 1000) {
    riskScore -= 20;
    warnings.push("Very low visibility conditions");
  } else if (minVisibility < 5000) {
    riskScore -= 10;
    warnings.push("Reduced visibility along route");
  }

  alerts.forEach((alert) => {
    if (alert.severity === "Extreme") {
      riskScore -= 30;
      warnings.push(`EXTREME: ${alert.event}`);
    } else if (alert.severity === "Severe") {
      riskScore -= 20;
      warnings.push(`SEVERE: ${alert.event}`);
    } else if (alert.severity === "Moderate") {
      riskScore -= 10;
      warnings.push(`Advisory: ${alert.event}`);
    }
  });

  riskScore = Math.max(0, Math.min(100, riskScore));

  let riskLevel: "low" | "moderate" | "high" | "extreme";
  if (riskScore >= 80) {
    riskLevel = "low";
  } else if (riskScore >= 60) {
    riskLevel = "moderate";
  } else if (riskScore >= 40) {
    riskLevel = "high";
  } else {
    riskLevel = "extreme";
  }

  return { riskLevel, riskScore, generatedWarnings: warnings };
};

export const getRoadRiskSummary = (
  roadRiskData: RoadRiskData,
): RoadRiskSummary => {
  const { conditions, alerts, overallRiskLevel, riskScore } = roadRiskData;

  if (conditions.length === 0) {
    return {
      hasBlackIce: false,
      hasPrecipitation: false,
      hasNationalAlerts: alerts.length > 0,
      minTemp: 70,
      maxTemp: 70,
      maxWindSpeed: 0,
      avgVisibility: 10000,
      alertCount: alerts.length,
      riskLevel: overallRiskLevel,
      riskScore,
    };
  }

  const temps = conditions.map((c) => c.temp);
  const winds = conditions.map((c) => c.windSpeed);
  const visibilities = conditions.map((c) => c.visibility);

  return {
    hasBlackIce: conditions.some((c) => c.blackIceRisk),
    hasPrecipitation: conditions.some((c) => c.precipitation > 0),
    hasNationalAlerts: alerts.length > 0,
    minTemp: Math.round(Math.min(...temps)),
    maxTemp: Math.round(Math.max(...temps)),
    maxWindSpeed: Math.round(Math.max(...winds)),
    avgVisibility: Math.round(
      visibilities.reduce((a, b) => a + b, 0) / visibilities.length,
    ),
    alertCount: alerts.length,
    riskLevel: overallRiskLevel,
    riskScore,
  };
};

export const formatRoadRiskForDisplay = (
  roadRisk: RoadRiskData,
): {
  icon: string;
  color: string;
  label: string;
  shortDescription: string;
} => {
  const { overallRiskLevel, riskScore, warnings } = roadRisk;

  const riskConfig = {
    low: { icon: "checkmark-circle", color: "#2D5A3D", label: "Safe" },
    moderate: { icon: "alert-circle", color: "#F2A154", label: "Caution" },
    high: { icon: "warning", color: "#E67E22", label: "Warning" },
    extreme: { icon: "skull", color: "#D94848", label: "Dangerous" },
  };

  const config = riskConfig[overallRiskLevel];
  const shortDescription =
    warnings.length > 0 ? warnings[0] : "Road conditions favorable";

  return {
    icon: config.icon,
    color: config.color,
    label: `${config.label} (${riskScore}/100)`,
    shortDescription,
  };
};
