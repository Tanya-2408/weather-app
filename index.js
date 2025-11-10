const https = require('https');

const getWeather = async (city) => {
  return new Promise((resolve, reject) => {
    https.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        try {
          const weatherData = JSON.parse(data);
          resolve(weatherData);
        } catch (err) {
          reject(new Error('Failed to parse weather data'));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

const city = process.argv[2];

if (!city) {
  console.log("Please provide a city name. Example: node index.js London");
  process.exit(1);
}

console.log("Fetching weather for:", city);

// Fetch and display weather data
getWeather(city)
  .then(data => {
    const current = data.current_condition[0];
    console.log(`Current temperature: ${current.temp_C}°C`);
    console.log(`Weather description: ${current.weatherDesc[0].value}`);
  })
  .catch(error => {
    console.error('Error fetching weather:', error.message);
  });