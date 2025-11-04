// api/get-weather.js

// We must import node-fetch to use fetch() on the server
const fetch = require('node-fetch');

// This is the main function Vercel will run
// It's an async function that handles the request
module.exports = async (request, response) => {
    // Get the city OR lat/lon from the request's query parameters
    // e.g., /api/get-weather?city=London
    const { city, lat, lon } = request.query;

    // This is the most important part:
    // We securely get the API key from Vercel's "Environment Variables"
    const API_KEY = process.env.API_KEY;

    let weatherURL;

    if (city) {
        weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${API_KEY}`;
    } else if (lat && lon) {
        weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=${API_KEY}`;
    } else {
        // If no city or coords, send a "Bad Request" error
        return response.status(400).json({ error: "Missing city or coordinates" });
    }

    try {
        // Call the OpenWeatherMap API from the server
        const apiResponse = await fetch(weatherURL);
        const data = await apiResponse.json();

        // Send the data back to your front-end
        return response.status(200).json(data);

    } catch (error) {
        // Handle any server-side errors
        return response.status(500).json({ error: 'Failed to fetch weather' });
    }
};