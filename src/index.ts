import { getWeather, compareLocations } from "./weather";

async function main() {
  console.log("=== Weather App ===\n");

  const helsinki = await getWeather(60.1699, 24.9384);
  console.log(`Current weather in Helsinki:`);
  console.log(`  Temperature: ${helsinki.current.temperature}°C`);
  console.log(`  Wind: ${helsinki.current.windspeed} km/h`);
  console.log(`  Conditions: ${helsinki.current.description}`);
  console.log();

  console.log("7-day forecast:");
  for (const day of helsinki.daily) {
    console.log(`  ${day.date}: ${day.minTemp}–${day.maxTemp}°C, rain ${day.precipitation}mm`);
  }
  console.log();

  console.log("Comparing Nordic capitals:");
  const cities = await compareLocations([
    { lat: 60.1699, lon: 24.9384, name: "Helsinki" },
    { lat: 59.3293, lon: 18.0686, name: "Stockholm" },
    { lat: 55.6761, lon: 12.5683, name: "Copenhagen" },
    { lat: 59.9139, lon: 10.7522, name: "Oslo" },
  ]);

  for (const city of cities) {
    console.log(
      `  ${city.name}: ${city.weather.current.temperature}°C, ${city.weather.current.description}`,
    );
  }
}

main();

