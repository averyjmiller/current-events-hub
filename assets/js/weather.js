document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('city-input').focus();
    
    const api_key = "11944d78b578fc7016e5a575aaac5c41";
    const units = "imperial";
    
    var uhub = JSON.parse(localStorage.getItem("uhub"));
    let cityHistory = uhub.savedLocations;

    let latitude = uhub.homeLocation.lat;
    let longitude = uhub.homeLocation.lon;
    let city = uhub.homeLocation.city;

    if(latitude && longitude) {
        getWeather(latitude, longitude);
        getForecast(latitude, longitude);
    } else if(city) {
        getWeatherByCity(city);
        getForecastByCity(city);
    }

    document.getElementById('city-search-form').addEventListener('click', function(e) {
        e.preventDefault();
        if(e.target.id == 'search-btn') {
          let city = document.getElementById('city-input').value;
          if(city && !cityHistory.includes(city)) {
              getWeatherByCity(city);
              getForecastByCity(city);
              addToHistory(city);
              document.getElementById('city-input').value = '';
          }
        } else if(e.target.id == 'clear-search-btn') {
          let uhub = JSON.parse(localStorage.getItem("uhub"));
          uhub.savedLocations = [];
          localStorage.setItem("uhub", JSON.stringify(uhub));
          updateCityHistory();
        }
    });


    function getWeather(latitude, longitude) {
        let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}&units=${units}`;

        fetch(api)
        .then(function (response) {
          if (response.ok) {
            response.json().then(function (data) {
                displayWeather(data);
            });
          } else {
            fetchErrorModal(response.status + " - " + response.statusText);
          }
        })
        .catch(function (error) {
          fetchErrorModal(error);
        });  
    }

    function getWeatherByCity(city) {
        let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=${units}`;

        fetch(api)
        .then(function (response) {
          if (response.ok) {
            response.json().then(function (data) {
                displayWeather(data);
            });
          } else {
            fetchErrorModal(response.status + " - " + response.statusText);
          }
        })
        .catch(function (error) {
          fetchErrorModal(error);
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

        updateCityHistory();
    }

    function getForecast(latitude, longitude) {
        let api = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${api_key}&units=${units}`;

        fetch(api)
        .then(function (response) {
          if (response.ok) {
            response.json().then(function (data) {
                displayForecast(data);
            });
          } else {
            fetchErrorModal(response.status + " - " + response.statusText);
          }
        })
        .catch(function (error) {
          fetchErrorModal(error);
        });  
    }

    function getForecastByCity(city) {
        let api = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=${units}`;

        fetch(api)
        .then(function (response) {
          if (response.ok) {
            response.json().then(function (data) {
                displayForecast(data);
            });
          } else {
            fetchErrorModal(response.status + " - " + response.statusText);
          }
        })
        .catch(function (error) {
          fetchErrorModal(error);
        });  
    }

    function displayForecast(data) {
        for (let i = 0; i < 5; i++) {
            let forecastDate = document.getElementById(`forecast-date-${i+1}`);
            let forecastIcon = document.getElementById(`forecast-icon-${i+1}`);
            let forecastTemp = document.getElementById(`forecast-temp-${i+1}`);
            let forecastDesc = document.getElementById(`forecast-desc-${i+1}`);
            forecastIcon.className = `fas fa-${getIcon(data.list[i*8].weather[0].main, false)} fa-3x mb-2`;
            forecastDate.innerText = new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toLocaleDateString();
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

    function addToHistory(city) {
        var uhub = JSON.parse(localStorage.getItem("uhub"));
        let cityHistory = uhub.savedLocations;
        cityHistory.push(city);
        localStorage.setItem("uhub", JSON.stringify(uhub));
    }

    function updateCityHistory() {
        var uhub = JSON.parse(localStorage.getItem("uhub"));
        let cityHistory = uhub.savedLocations;

        let historyDisplay = document.getElementById('search-history');
        historyDisplay.innerHTML = '';

        for(let i = 0; i < cityHistory.length; i++) {
            let btn = document.createElement('button');
            var cityName =
            cityHistory[i].charAt(0).toUpperCase()
            + cityHistory[i].slice(1);
            btn.innerText = cityName;
            btn.value = cityHistory[i];
            btn.onclick = function() {
                getWeatherByCity(btn.value);
                getForecastByCity(btn.value);
            };
            historyDisplay.appendChild(btn);
        }
    }

	function fetchErrorModal(err) {
    var errModal = document.getElementById("fetchError");
    errModal.innerHTML = `
    <div class="modal-content">
      <h5>${err}</h5>
      <p>Something went wrong on our end.</p>
      <button id="dismiss-btn">Dismiss</button>
    </div>
    `;
    errModal.style.display = "block";

    document.getElementById("dismiss-btn").addEventListener("click", function(event) {
      event.preventDefault();

      errModal.style.display = "none";
    });
  }
});