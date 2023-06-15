document.addEventListener("DOMContentLoaded", function() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    } else {
        let city = prompt("Please enter your city name:");
        if(city) {
            getWeatherByCity(city);
            getForecastByCity(city);
        }
    }

    function setPosition(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        getWeather(latitude, longitude);
        getForecast(latitude, longitude);
    }

    function showError(error) {
        let city = prompt("Unable to retrieve your location. Please enter your city name:");
        if(city) {
            getWeatherByCity(city);
            getForecastByCity(city);
        }
    }

    const api_key = "11944d78b578fc7016e5a575aaac5c41";
    const units = "imperial"; // For Fahrenheit temperature

    function getWeather(latitude, longitude) {
        let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}&units=${units}`;
        
        fetch(api)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                displayWeather(data);
            });
    }

    function getWeatherByCity(city) {
        let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=${units}`;
        
        fetch(api)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                displayWeather(data);
            });
    }

    function displayWeather(data) {
        let city = document.getElementById('city-name');
        let date = document.getElementById('current-date');
        let temp = document.getElementById('current-temp');
        let dailyTemp = document.getElementById('daily-temp');
        let currentWeatherIcon = document.getElementById('current-weather-icon');
    
        currentWeatherIcon.className = `fas fa-${getIcon(data.weather[0].main, true)} fa-3x mb-2`;
        city.innerText = data.name;
        date.innerText = new Date().toLocaleDateString();
        temp.innerText = `Current Temperature: ${data.main.temp.toFixed(0)}°F`;
        dailyTemp.innerHTML = `High: ${data.main.temp_max.toFixed(0)}°F / Low: ${data.main.temp_min.toFixed(0)}°F`;
    }    

    function getForecast(latitude, longitude) {
        let api = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${api_key}&units=${units}`;

        fetch(api)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                displayForecast(data);
            });
    }

    function getForecastByCity(city) {
        let api = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=${units}`;

        fetch(api)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                displayForecast(data);
            });
    }

    function displayForecast(data) {
        for (let i = 0; i < 5; i++) {
            let forecastDate = document.getElementById(`forecast-date-${i+1}`);
            let forecastIcon = document.getElementById(`forecast-icon-${i+1}`);
            let forecastTemp = document.getElementById(`forecast-temp-${i+1}`);
            let forecastDesc = document.getElementById(`forecast-desc-${i+1}`);
            
            forecastIcon.className = `fas fa-${getIcon(data.list[i*8].weather[0].main, false)} fa-3x mb-2`;
            forecastDate.innerText = new Date(data.list[i*8].dt_txt).toLocaleDateString();
            forecastTemp.innerText = `Predicted Temp: ${data.list[i*8].main.temp.toFixed(0)}°F`;
            forecastDesc.innerText = data.list[i*8].weather[0].description.charAt(0).toUpperCase() + data.list[i*8].weather[0].description.slice(1);
        }
    }    

    function getIcon(weather, isCurrent) {
        switch (weather) {
            case 'Clear':
                let hour = new Date().getHours();
                return isCurrent && (hour < 6 || hour > 18) ? 'moon' : 'sun';
            case 'Clouds':
                return 'cloud';
            case 'Rain':
            case 'Drizzle':
            case 'Mist':
                return 'cloud-rain';
            case 'Thunderstorm':
                return 'bolt';
            case 'Snow':
                return 'snowflake';
            default:
                return 'sun';
        }
    }
});
