let cityName = document.querySelector(".weather-city");
let date_time = document.querySelector(".weather-date_time");
let w_forecast = document.querySelector(".weather-forecast");
let w_icon = document.querySelector(".weather-icon");
let w_temperature = document.querySelector(".weather-temperature");
let feelslike = document.querySelector(".weather-feellike");
let humidity = document.querySelector(".weather-humidity");
let w_wind = document.querySelector(".weather-wind");
let pressure = document.querySelector(".weather-pressure");
let citySearch = document.querySelector(".weather-search");

const getDateTime = (dt) => {
    const currDate = new Date(dt * 1000);

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
    }

    const formatter = new Intl.DateTimeFormat("en-US", options);
    console.log(formatter)
    return formatter.format(currDate);
}

let city = "Delhi";

citySearch.addEventListener("submit",async (e)=>{
    e.preventDefault();
    let citySearched = document.querySelector(".city-name");
    //console.log(citySearched.value);
    city = citySearched.value.trim();
    if (city) {
        await getWeatherInfo();
        citySearched.value = ""; 
    }
})

const getWeatherInfo = async () => {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${API_KEY}`;
    try {   
         w_temperature.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        const res = await fetch(weatherURL);
        
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'City not found');
        }
        
        const data = await res.json();
        console.log(data);
        
        if (!data.name || !data.main) {
            throw new Error('Invalid weather data received');
        }
        

        const { main, name, weather, wind, sys, dt } = data;
        cityName.innerHTML = `${name}, ${sys.country}`;
        date_time.innerHTML = getDateTime(dt);
        w_forecast.innerHTML = weather[0].main
        w_icon.innerHTML = `<img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].main}">`;
        w_temperature.innerHTML = `${main.temp}&#176 C`;
        feelslike.innerHTML = `${main.feels_like}&#176`;
        humidity.innerHTML = `${main.humidity}%`;
        w_wind.innerHTML = `${wind.speed} m/s`;
        pressure.innerHTML = `${main.pressure} hPa`;
    } catch (error) {
        cityName.innerHTML = '';
        w_icon.innerHTML = '';
        w_temperature.innerHTML = '';
        
        if (error.message.includes('404') || error.message.includes('not found')) {
            w_forecast.innerHTML = 'City not found. Try another location.';
        } else {
            w_forecast.innerHTML = 'Error fetching weather. Try again later.';
        }
        
        console.error('API Error:', error);
    }
}

// NEW FUNCTION TO FETCH BY COORDS
const getWeatherByCoords = async (lat, lon) => {
    // This URL is different: it uses lat and lon
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=${API_KEY}`;
    
    try {   
        w_temperature.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        const res = await fetch(weatherURL);
        
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Location not found');
        }
        
        const data = await res.json();
        console.log(data);
        
        if (!data.name || !data.main) {
            throw new Error('Invalid weather data received');
        }
        
        // This is the same logic as your other function
        const { main, name, weather, wind, sys, dt } = data;
        cityName.innerHTML = `${name}, ${sys.country}`;
        date_time.innerHTML = getDateTime(dt);
        w_forecast.innerHTML = weather[0].main
        w_icon.innerHTML = `<img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].main}">`;
        w_temperature.innerHTML = `${main.temp}&#176 C`;
        feelslike.innerHTML = `${main.feels_like}&#176`;
        humidity.innerHTML = `${main.humidity}%`;
        w_wind.innerHTML = `${wind.speed} m/s`;
        pressure.innerHTML = `${main.pressure} hPa`;

        // (Optional) Update the global city variable
        city = name; 
        
    } catch (error) {
        // Handle errors just in case
        w_temperature.innerHTML = '';
        w_forecast.innerHTML = 'Error fetching weather.';
        console.error('API Error:', error);
    }
}

// Just call the function directly on load
// REPLACE IT WITH THIS
window.addEventListener("load", () => {
    // First, check if the browser supports Geolocation
    if (navigator.geolocation) {
        // If it does, ask for the user's position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // SUCCESS!
                // We got the location, call our new function
                const { latitude, longitude } = position.coords;
                getWeatherByCoords(latitude, longitude);
            },
            (error) => {
                // ERROR / PERMISSION DENIED
                // User said no, or we couldn't get location.
                // Fall back to your default city.
                console.warn("User denied location or error occurred. Defaulting to Surat.");
                getWeatherInfo(); // This calls your original function
            }
        );
    } else {
        // BROWSER DOESN'T SUPPORT GEOLOCATION
        // Fall back to your default city.
        console.log("Geolocation not supported by this browser. Defaulting to Surat.");
        getWeatherInfo(); // This calls your original function
    }
});