document.addEventListener("DOMContentLoaded", () => {
  const locationForm = document.getElementById("location-form");
  const weatherInfo = document.getElementById("weather-info");
  const alertsSection = document.getElementById("alerts");
  const loadingScreen = document.getElementById("loading-screen");

  // Function to fetch weather data
  const fetchWeather = async (country, city) => {
    const apiKey = "fb8d066b44d875c0449877403fa684ec"; // Replace with your API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric`;
    try {
      loadingScreen.style.display = "flex";
      const response = await fetch(url);
      const data = await response.json();
      if (data.cod === 200) {
        displayWeather(data);
      } else {
        weatherInfo.innerHTML = `<p>${data.message}</p>`;
      }
    } catch (error) {
      weatherInfo.innerHTML = "<p>Failed to fetch weather data.</p>";
    } finally {
      //here nonz
    }
  };

  // Function to display weather data
  const displayWeather = (data) => {
    weatherInfo.innerHTML = `
      <h3>${data.name}, ${data.sys.country}</h3>
      <p>Temperature: ${data.main.temp}°C</p>
      <p>Weather: ${data.weather[0].description}</p>
    `;
  };

  // Save user location
  locationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const country = document.getElementById("country").value.trim();
    const city = document.getElementById("city").value.trim();
    localStorage.setItem("country", country);
    localStorage.setItem("city", city);
    fetchWeather(country, city);
  });

  // Load saved location
  const savedCountry = localStorage.getItem("country");
  const savedCity = localStorage.getItem("city");
  if (savedCountry && savedCity) {
    fetchWeather(savedCountry, savedCity);
  }
});
