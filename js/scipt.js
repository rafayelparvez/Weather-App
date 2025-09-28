// API Key
const API_KEY = "6f6beeb05a96bcc327da72061f4c0a65";  

const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const weatherInfoSection = document.querySelector(".weather-info");
const searchCitySection = document.querySelector(".search-city");
const notFoundSection = document.querySelector(".not-found");

const countryTxt = document.querySelector(".country-txt");
const currentDateTxt = document.querySelector(".current-date-txt");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidityTxt = document.querySelector(".humidity-value-txt");
const windTxt = document.querySelector(".Wind-value-txt");
const weatherIcon = document.querySelector(".weather-summary-img");
const forecastContainer = document.querySelector(".forecast-items-container");

// Custom Icon Mapping
const weatherIcons = {
  Clear: "images/clear.svg",
  Clouds: "images/clouds.svg",
  Rain: "images/rain.svg",
  Snow: "images/snow.svg",
  Mist: "images/weather/mist.png",
  Thunderstorm: "images/thunderstorm.svg"
};

// তারিখ ফরম্যাট করার ফাংশন
function formatDate(date) {
  const options = { weekday: "short", day: "numeric", month: "short" };
  return date.toLocaleDateString("en-US", options);
}

// Weather ডাটা ফেচ
async function getWeather(city) {
  try {
    // Current Weather
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const weatherRes = await fetch(weatherURL);
    if (!weatherRes.ok) throw new Error("City not found");
    const weatherData = await weatherRes.json();

    // Forecast (5-day)
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    const forecastRes = await fetch(forecastURL);
    const forecastData = await forecastRes.json();

    // UI আপডেট
    updateWeatherUI(weatherData, forecastData);
  } catch (error) {
    showNotFound();
  }
}

// Weather ডাটা UI তে দেখানোর ফাংশন
function updateWeatherUI(weatherData, forecastData) {
  // সেকশন Visibility
  weatherInfoSection.style.display = "block";
  searchCitySection.style.display = "none";
  notFoundSection.style.display = "none";

  // Current Weather Info
  countryTxt.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
  currentDateTxt.textContent = formatDate(new Date());
  tempTxt.textContent = `${Math.round(weatherData.main.temp)} °C`;
  conditionTxt.textContent = weatherData.weather[0].main;
  humidityTxt.textContent = `${weatherData.main.humidity}%`;
  windTxt.textContent = `${weatherData.wind.speed} m/s`;

  // Current Weather Icon
  const mainCondition = weatherData.weather[0].main;
  weatherIcon.src = weatherIcons[mainCondition] || "images/weather/default.png";

  // Forecast Info
  forecastContainer.innerHTML = "";
  const dailyForecast = forecastData.list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  dailyForecast.slice(0, 6).forEach(forecast => {
    const date = new Date(forecast.dt * 1000);
    const forecastCondition = forecast.weather[0].main;
    const forecastIcon = weatherIcons[forecastCondition] || "images/weather/default.png";

    const forecastHTML = `
      <div class="forecast-item">
        <h5 class="forecast-item-date regular-txt">${formatDate(date)}</h5>
        <img src="${forecastIcon}" class="forecast-item-img">
        <h5 class="forecast-item-temp">${Math.round(forecast.main.temp)} °C</h5>
      </div>
    `;
    forecastContainer.insertAdjacentHTML("beforeend", forecastHTML);
  });
}

// Not Found দেখানোর ফাংশন
function showNotFound() {
  weatherInfoSection.style.display = "none";
  searchCitySection.style.display = "none";
  notFoundSection.style.display = "block";
}

// Search Event
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city !== "") getWeather(city);
});

// Enter Key এও কাজ করবে
cityInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city !== "") getWeather(city);
  }
});
