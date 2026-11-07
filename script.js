const city = document.getElementById("city");
const searchbtn = document.getElementById("searchbtn");

const cityname = document.getElementById("cityname");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const weathericon = document.getElementById("weathericon");

const humidity = document.getElementById("humidity");
const windspeed = document.getElementById("windspeed");
const feelslike = document.getElementById("feelslike");

const message = document.getElementById("message");

function getweatherinfo(code) {
    if (code === 0) {
        return {
            text: "Clear Sky",
            icon: "☀️"
        };
    }

    if (code === 1 || code === 2) {
        return {
            text: "Partly Cloudy",
            icon: "🌤️"
        };
    }

    if (code === 3) {
        return {
            text: "Cloudy",
            icon: "☁️"
        };
    }

    if ([45, 48].includes(code)) {
        return {
            text: "Foggy",
            icon: "🌫️"
        };
    }

    if ([51, 53, 55, 56, 57].includes(code)) {
        return {
            text: "Drizzle",
            icon: "🌦️"
        };
    }

    if ([61, 63, 65, 66, 67, 80 , 81, 82].includes(code)) {
        return {
            text: "Rainy",
            icon: "🌧️"
        };
    }

    if ([71, 73, 75, 77, 85, 86].includes(code)) {
        return {
            text: "Snowy",
            icon: "❄️"
        };
    }

    if ([95, 96, 99].includes(code)) {
        return {
            text: "Thunderstorm",
            icon: "⛈️"
        };
    }

    return {
        text: "Unknown Weather",
        icon: "🌍"
    };
}

async function getWeather(city) {
    if (city.trim() === "") {
        message.textContent = "Please enter a city name!";
        return;
    }

    message.textContent = "Searching weather";

    searchbtn.disabled = true;
    searchbtn.textContent = "Loading";

    try {
        const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json`;
        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable  to search city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found! Try another city.");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to get weather information.");
        }

        const weatherData = await weatherResponse.json();
        displayWeather(location,weatherData);
        message.textContent = "";

    } catch (error) {

        message.textContent = error.message;

    } finally {
        searchbtn.disabled = false;
        searchbtn.textContent = "Search";
    }
}

function displayWeather(location, data) {
    const current = data.current;
    const weather = getweatherinfo(current.weather_code);

    cityname.textContent = `${location.name}, ${location.country}`;
    temperature.textContent = `${Math.round(current.temperature_2m)}°C`;
    
    weathericon.textContent = weather.icon;

    description.textContent = weather.text;
    humidity.textContent = `${current.relative_humidity_2m}%`;

    windspeed.textContent = `${current.wind_speed_10m} km/h`;
    feelslike.textContent = `${Math.round(current.apparent_temperature)}°C`;
}

searchbtn.addEventListener("click", () => {

    getWeather(city.value);

});

city.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        getWeather(city.value);

    }
});

getWeather("Mysuru");