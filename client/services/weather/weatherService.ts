// Open-Meteo API - Free weather service (no API key required)
const OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast";

// WMO Weather Code to condition mapping
const getWeatherCondition = (
  code: number,
): { condition: string; description: string; icon: string } => {
  if (code === 0)
    return { condition: "Clear", description: "clear sky", icon: "01d" };
  if (code <= 3)
    return { condition: "Clouds", description: "partly cloudy", icon: "02d" };
  if (code <= 9)
    return { condition: "Clouds", description: "overcast", icon: "03d" };
  if (code <= 19) return { condition: "Fog", description: "fog", icon: "50d" };
  if (code <= 29)
    return { condition: "Rain", description: "drizzle", icon: "09d" };
  if (code <= 39)
    return { condition: "Rain", description: "rain", icon: "10d" };
  if (code <= 49)
    return { condition: "Snow", description: "snow", icon: "13d" };
  if (code <= 59)
    return { condition: "Rain", description: "freezing rain", icon: "10d" };
  if (code <= 69)
    return { condition: "Snow", description: "snow", icon: "13d" };
  if (code <= 79)
    return { condition: "Rain", description: "rain showers", icon: "09d" };
  if (code <= 84)
    return { condition: "Snow", description: "snow showers", icon: "13d" };
  if (code <= 94)
    return { condition: "Rain", description: "thunderstorm", icon: "11d" };
  return {
    condition: "Thunderstorm",
    description: "thunderstorm with hail",
    icon: "11d",
  };
};

export interface ForecastDay {
  date: string;
  temperature: number;
  tempMin?: number;
  tempMax?: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  rain: number;
}

export interface HourlyForecast {
  time: string;
  hour: number;
  temperature: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

export interface WeatherData {
  success: boolean;
  temperature?: number;
  feelsLike?: number;
  condition?: string;
  description?: string;
  icon?: string;
  humidity?: number;
  windSpeed?: number;
  windDirection?: number;
  visibility?: number;
  cloudCover?: number;
  error?: string;
}

export interface HourlyForecastData {
  success: boolean;
  hourly?: HourlyForecast[];
  error?: string;
}

export interface DetailedForecastData {
  success: boolean;
  current?: WeatherData;
  hourly?: HourlyForecast[];
  daily?: ForecastDay[];
  locationName?: string;
  error?: string;
}

export interface ForecastData {
  success: boolean;
  forecasts?: ForecastDay[];
  error?: string;
}

export interface WeatherAlert {
  type: "warning" | "advisory";
  title: string;
  description: string;
}

export interface AlertsData {
  success: boolean;
  alerts?: WeatherAlert[];
  currentWeather?: WeatherData;
  error?: string;
}

export interface RouteWeatherData {
  success: boolean;
  start?: WeatherData;
  middle?: WeatherData;
  end?: WeatherData;
  overallCondition?: string;
  error?: string;
}

export const getCurrentWeather = async (
  latitude: number,
  longitude: number,
): Promise<WeatherData> => {
  try {
    const url = `${OPEN_METEO_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,visibility,cloud_cover&timezone=auto`;
    const response = await fetch(url);

    if (!response.ok) {
      return {
        success: false,
        error: `Weather unavailable (${response.status})`,
      };
    }

    const data = await response.json();
    const current = data.current;
    const condition = getWeatherCondition(current.weather_code);

    return {
      success: true,
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      condition: condition.condition,
      description: condition.description,
      icon: condition.icon,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      windDirection: current.wind_direction_10m,
      visibility: current.visibility,
      cloudCover: current.cloud_cover,
      // Open-Meteo doesn't provide sunrise/sunset in current endpoint, would need separate call
    };
  } catch (error: any) {
    console.log("Weather fetch issue:", error?.message?.substring(0, 60));
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getForecast = async (
  latitude: number,
  longitude: number,
): Promise<ForecastData> => {
  try {
    const url = `${OPEN_METEO_BASE_URL}?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,wind_speed_10m_max,precipitation_sum&timezone=auto&forecast_days=5`;
    const response = await fetch(url);

    if (!response.ok) {
      return {
        success: false,
        error: `Forecast unavailable (${response.status})`,
      };
    }

    const data = await response.json();
    const daily = data.daily;

    const dailyForecasts: ForecastDay[] = [];
    for (let i = 0; i < daily.time.length; i++) {
      const condition = getWeatherCondition(daily.weather_code[i]);
      dailyForecasts.push({
        date: new Date(daily.time[i]).toLocaleDateString(),
        temperature: Math.round(
          (daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2,
        ),
        tempMin: Math.round(daily.temperature_2m_min[i]),
        tempMax: Math.round(daily.temperature_2m_max[i]),
        condition: condition.condition,
        description: condition.description,
        icon: condition.icon,
        humidity: daily.relative_humidity_2m_max[i],
        windSpeed: Math.round(daily.wind_speed_10m_max[i]),
        rain: daily.precipitation_sum[i],
      });
    }

    return {
      success: true,
      forecasts: dailyForecasts,
    };
  } catch (error: any) {
    console.log("Forecast fetch issue:", error?.message?.substring(0, 60));
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getWeatherAlerts = async (
  latitude: number,
  longitude: number,
): Promise<AlertsData> => {
  try {
    const weather = await getCurrentWeather(latitude, longitude);

    if (!weather.success) return { success: false, error: weather.error };

    const alerts: WeatherAlert[] = [];

    if (weather.condition === "Thunderstorm") {
      alerts.push({
        type: "warning",
        title: "Thunderstorm Warning",
        description: "Thunderstorms in the area. Exercise caution.",
      });
    }

    if (weather.condition === "Snow") {
      alerts.push({
        type: "advisory",
        title: "Snow Advisory",
        description: "Snowy conditions. Roads may be slippery.",
      });
    }

    if (weather.windSpeed && weather.windSpeed > 25) {
      alerts.push({
        type: "advisory",
        title: "High Wind Advisory",
        description: `Wind speeds reaching ${weather.windSpeed} mph.`,
      });
    }

    return {
      success: true,
      alerts: alerts,
      currentWeather: weather,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

interface RouteCoordinate {
  latitude: number;
  longitude: number;
}

export const getRouteWeather = async (
  routeCoordinates: RouteCoordinate[],
): Promise<RouteWeatherData> => {
  try {
    if (!routeCoordinates || routeCoordinates.length < 2) {
      return { success: false, error: "Invalid route coordinates" };
    }

    const startPoint = routeCoordinates[0];
    const middlePoint =
      routeCoordinates[Math.floor(routeCoordinates.length / 2)];
    const endPoint = routeCoordinates[routeCoordinates.length - 1];

    const [startWeather, middleWeather, endWeather] = await Promise.all([
      getCurrentWeather(startPoint.latitude, startPoint.longitude),
      getCurrentWeather(middlePoint.latitude, middlePoint.longitude),
      getCurrentWeather(endPoint.latitude, endPoint.longitude),
    ]);

    return {
      success: true,
      start: startWeather,
      middle: middleWeather,
      end: endWeather,
      overallCondition: getMostSevereCondition([
        startWeather.condition || "Clear",
        middleWeather.condition || "Clear",
        endWeather.condition || "Clear",
      ]),
    };
  } catch (error: any) {
    console.log("Route weather fetch issue:", error?.message?.substring(0, 60));
    return {
      success: false,
      error: error.message,
    };
  }
};

const getMostSevereCondition = (conditions: string[]): string => {
  const severity: { [key: string]: number } = {
    Thunderstorm: 5,
    Tornado: 5,
    Snow: 4,
    Rain: 3,
    Drizzle: 2,
    Clouds: 1,
    Clear: 0,
  };

  let mostSevere = "Clear";
  let highestSeverity = 0;

  conditions.forEach((condition) => {
    const level = severity[condition] || 0;
    if (level > highestSeverity) {
      highestSeverity = level;
      mostSevere = condition;
    }
  });

  return mostSevere;
};

export const getWeatherIconName = (iconCode: string): string => {
  if (iconCode.startsWith("01")) return "sun";
  if (iconCode.startsWith("02")) return "cloud";
  if (iconCode.startsWith("03")) return "cloud";
  if (iconCode.startsWith("04")) return "cloud";
  if (iconCode.startsWith("09")) return "cloud-rain";
  if (iconCode.startsWith("10")) return "cloud-rain";
  if (iconCode.startsWith("11")) return "cloud-lightning";
  if (iconCode.startsWith("13")) return "cloud-snow";
  if (iconCode.startsWith("50")) return "cloud";
  return "cloud";
};

export const getWindDirection = (degrees: number): string => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

export const getDetailedForecast = async (
  latitude: number,
  longitude: number,
): Promise<DetailedForecastData> => {
  try {
    // Get current weather and hourly forecast from Open-Meteo
    const currentUrl = `${OPEN_METEO_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,visibility,cloud_cover&hourly=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation_probability&timezone=auto&forecast_days=3`;
    const response = await fetch(currentUrl);

    if (!response.ok) {
      return {
        success: false,
        error: `Forecast unavailable (${response.status})`,
      };
    }

    const data = await response.json();
    const current = data.current;
    const hourly = data.hourly;

    const currentWeather: WeatherData = {
      success: true,
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      ...getWeatherCondition(current.weather_code),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      windDirection: current.wind_direction_10m,
      visibility: current.visibility,
      cloudCover: current.cloud_cover,
    };

    const hourlyForecasts: HourlyForecast[] = [];
    for (let i = 0; i < Math.min(hourly.time.length, 24); i++) {
      const date = new Date(hourly.time[i]);
      const condition = getWeatherCondition(hourly.weather_code[i]);
      hourlyForecasts.push({
        time: date.toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: true,
        }),
        hour: date.getHours(),
        temperature: Math.round(hourly.temperature_2m[i]),
        condition: condition.condition,
        description: condition.description,
        icon: condition.icon,
        humidity: hourly.relative_humidity_2m[i],
        windSpeed: Math.round(hourly.wind_speed_10m[i]),
        precipitation: hourly.precipitation_probability[i],
      });
    }

    // Get daily forecast
    const dailyUrl = `${OPEN_METEO_BASE_URL}?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,wind_speed_10m_max,precipitation_sum&timezone=auto&forecast_days=5`;
    const dailyResponse = await fetch(dailyUrl);

    let dailyForecasts: ForecastDay[] = [];
    if (dailyResponse.ok) {
      const dailyData = await dailyResponse.json();
      const daily = dailyData.daily;

      for (let i = 0; i < daily.time.length; i++) {
        const condition = getWeatherCondition(daily.weather_code[i]);
        dailyForecasts.push({
          date: new Date(daily.time[i]).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          temperature: Math.round(
            (daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2,
          ),
          tempMin: Math.round(daily.temperature_2m_min[i]),
          tempMax: Math.round(daily.temperature_2m_max[i]),
          condition: condition.condition,
          description: condition.description,
          icon: condition.icon,
          humidity: daily.relative_humidity_2m_max[i],
          windSpeed: Math.round(daily.wind_speed_10m_max[i]),
          rain: daily.precipitation_sum[i],
        });
      }
    }

    return {
      success: true,
      current: currentWeather,
      hourly: hourlyForecasts,
      daily: dailyForecasts,
      locationName: "Current Location",
    };
  } catch (error: any) {
    console.log(
      "Detailed forecast fetch issue:",
      error?.message?.substring(0, 60),
    );
    return {
      success: false,
      error: error.message,
    };
  }
};
