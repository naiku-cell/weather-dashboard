const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');

// Use a free geocoding API to convert city → lat/lon.
// Here we use Open-Meteo’s own geocoding service:
async function geocode(city) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
  const resp = await fetch(geoUrl);
  const data = await resp.json();
  if (!data.results || data.results.length === 0) {
    throw new Error('City not found');
  }
  return {
    latitude: data.results[0].latitude,
    longitude: data.results[0].longitude,
    name: data.results[0].name,
    country: data.results[0].country
  };
}

async function getWeather(lat, lon) {
  // Get current weather
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
  const resp = await fetch(url);
  const data = await resp.json();
  return data.current_weather;
}

searchBtn.addEventListener('click', async () => {
  const city = cityInput.value.trim();
  if (!city) {
    alert('Please enter a city name');
    return;
  }
  weatherInfo.innerHTML = '<p>Loading...</p>';
  try {
    const loc = await geocode(city);
    const current = await getWeather(loc.latitude, loc.longitude);
    displayWeather(loc, current);
  } catch (err) {
    weatherInfo.innerHTML = `<p>${err.message}</p>`;
  }
});
function weatherCodeToDescription(code) {
  const codes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Drizzle: Light",
    53: "Drizzle: Moderate",
    55: "Drizzle: Dense",
    56: "Freezing Drizzle: Light",
    57: "Freezing Drizzle: Dense",
    61: "Rain: Slight",
    63: "Rain: Moderate",
    65: "Rain: Heavy",
    66: "Freezing Rain: Light",
    67: "Freezing Rain: Heavy",
    71: "Snow: Slight",
    73: "Snow: Moderate",
    75: "Snow: Heavy",
    77: "Snow grains",
    80: "Rain showers: Slight",
    81: "Rain showers: Moderate",
    82: "Rain showers: Violent",
    85: "Snow showers: Slight",
    86: "Snow showers: Heavy",
    95: "Thunderstorm: Slight/Moderate",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
  };
  return codes[code] || "Unknown";
}


function displayWeather(location, weather) {
  weatherInfo.innerHTML = `
    <h2>${location.name}, ${location.country}</h2>
    <p>Temperature: ${weather.temperature}°C</p>
    <p>Windspeed: ${weather.windspeed} km/h</p>
    <p>Wind direction: ${weather.winddirection}°</p>
    <p>Weather: ${weatherCodeToDescription(weather.weathercode)}</p>
  `;
}

