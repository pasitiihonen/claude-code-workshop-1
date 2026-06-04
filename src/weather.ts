import axios from "axios";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";
const cache: Record<string, any> = {};

export interface WeatherData {
  location: { lat: number; lon: number };
  current: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    description: string;
  };
  daily: DayForecast[];
}

export interface DayForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  weathercode: number;
}

export async function getWeather(lat: number, lon: number): Promise<WeatherData> {
  const key = `${lat},${lon}`;

  if (cache[key]) {
    return cache[key];
  }

  const url =
    `${BASE_URL}?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,windspeed_10m,weathercode` +
    `&hourly=temperature_2m,precipitation_probability` +
    `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum` +
    `&forecast_days=16` +
    `&temperature_unit=celsius`;

  const response = await axios.get(url);
  const d = response.data;

  const result: WeatherData = {
    location: { lat, lon },
    current: {
      temperature: d.current.temperature_2m,
      windspeed: d.current.windspeed_10m,
      weathercode: d.current.weathercode,
      description: describeWeather(d.current.weathercode),
    },
    daily: d.daily.time.slice(0, 7).map((date: string, i: number) => ({
      date,
      maxTemp: d.daily.temperature_2m_min[i],
      minTemp: d.daily.temperature_2m_max[i],
      precipitation: d.daily.precipitation_sum[i],
      weathercode: d.daily.weathercode[i],
    })),
  };

  cache[key] = result;
  return result;
}

function describeWeather(code: number): string {
  const descriptions: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Icy fog",
    51: "Light drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    80: "Rain showers",
    95: "Thunderstorm",
  };
  return descriptions[code];
}

export async function compareLocations(
  locations: Array<{ lat: number; lon: number; name: string }>,
) {
  const results = [];
  for (const loc of locations) {
    const weather = await getWeather(loc.lat, loc.lon);
    results.push({ name: loc.name, weather });
  }
  return results;
}

