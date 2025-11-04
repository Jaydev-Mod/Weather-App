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

let city = "Surat";

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
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=d72b797b6b1b7b7fa18575eb26067db7`;

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

document.body.addEventListener("load", getWeatherInfo);