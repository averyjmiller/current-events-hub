document.addEventListener('DOMContentLoaded', function() {
  // ------------TASK MANAGER--------------
  function renderTasks() {
    const taskDateElement = document.getElementById('task-date');
    const date = new Date();
    const dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    taskDateElement.textContent = dateString;

    const tasksContainer = document.getElementById('tasks');
    tasksContainer.innerHTML = "";
    var uhub = JSON.parse(localStorage.getItem("uhub"));
    let tasks = uhub.tasks;

    tasks.sort((a, b) => b.priority - a.priority);

    localStorage.setItem("uhub", JSON.stringify(uhub));

    tasks.forEach((task, index) => {
      let taskCard = document.createElement('div');
      taskCard.className = "card mb-3 not-completed";
      taskCard.style.color = "black";

      if(task.priority) {
        taskCard.classList.add('high-priority');
      }
      if(task.completed) {
        taskCard.classList.remove('not-completed');
        taskCard.classList.add('completed');
      }

      taskCard.innerHTML = `
        <div class="card-body d-flex justify-content-between align-items-center">
          <i id="trash${index}" class="fas fa-trash"></i>
            ${task.text}
            <input id="check${index}" type="checkbox" ${task.completed ? "checked" : ""}>
        </div>
      `;

      tasksContainer.appendChild(taskCard);
    });
  }

  document.getElementById('add-task').addEventListener('click', function() {
    var modal = document.getElementById("new-task");
    modal.style.display = "block";
    document.getElementById('taskInput').focus();
  });

  document.getElementById('task-btns').addEventListener('click', function(e) {
    e.preventDefault();
    var buttonClicked = e.target;

    if(buttonClicked.id == 'confirmButton') {
      let taskInput = document.getElementById('taskInput');
      let priorityCheck = document.getElementById('priorityCheck');

      var uhub = JSON.parse(localStorage.getItem("uhub"));
      let tasks = uhub.tasks;

      tasks.push({
          text: taskInput.value,
          priority: priorityCheck.checked,
          completed: false
      });

      taskInput.value = "";
      priorityCheck.checked = false;

      localStorage.setItem("uhub", JSON.stringify(uhub));
      var modal = document.getElementById("new-task");
      modal.style.display = "none";
      renderTasks();
    } else if(buttonClicked.id == 'cancelButton') {
      var modal = document.getElementById("new-task");
      modal.style.display = "none";
      taskInput.value = "";
      priorityCheck.checked = false;
    }
  });

  document.getElementById('tasks').addEventListener('click', function(e) {
    e.preventDefault();
    var target = e.target;
    if(target.id.includes('trash')) {
      var index = target.id.slice(5);
      var uhub = JSON.parse(localStorage.getItem("uhub"));
      let tasks = uhub.tasks;
      tasks.splice(index, 1);
      localStorage.setItem("uhub", JSON.stringify(uhub));
      renderTasks();
    }
  });

  document.getElementById('tasks').addEventListener('click', function(e) {
    e.preventDefault();
    var target = e.target;
    if(target.id.includes('check')) {
      var index = target.id.slice(5);
      var uhub = JSON.parse(localStorage.getItem("uhub"));
      let tasks = uhub.tasks;
      if(tasks[index].completed) {
        tasks[index].completed = false;
      } else {
        tasks[index].completed = true;
      }
      localStorage.setItem("uhub", JSON.stringify(uhub));
      renderTasks();
    }
  });

  // ------------FEATURED NEWS--------------
  function fetchFeaturedNews() {
    var url = "https://api.newscatcherapi.com/v2/latest_headlines?" +
    "countries=US" +
    "&lang=en" +
    "&when=1h" +
    "&topic=news" +
    "&page_size=2";
    var options = {
    method: 'GET',
    headers: {
      'x-api-key': 'nXw-bLLeQMcZrLQBtOZ6PpZiwZy4ypjSEpQ4j67k-0E',
    }
  };

    fetch(url, options)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            renderFeaturedNews(data.articles);
          });
        } else {
          fetchErrorModal(response.status + " - " + response.statusText);
        }
      })
      .catch(function (error) {
        fetchErrorModal(error);
      });
  }

  function renderFeaturedNews(news) {
    console.log(news);

    var newsContents= ``;

    for(var i = 0; i < news.length; i++) {
      if(news[1].media) {
        var image = news[i].media;
      } else {
        var image = "./assets/images/default_news.jpeg";
      }
      if(news[i].clean_url) {
        var source = news[i].clean_url;
      } else {
        var source = "Unknown";
      }
      if(news[i].published_date) {
        var publishedDate = news[i].published_date.slice(0, 10).split("-");
        publishedDate = publishedDate[1] + "/" + publishedDate[2] + "/" + publishedDate[0];
      } else {
        var publishedDate = "Unknown";
      }
      if(news[i].title) {
        var title = news[i].title;
      } else {
        var title = "";
      }
      if(news[i].link) {
        var url = news[i].link;
      } else {
        var url = "";
      }
      if(news[i].excerpt) {
        var count = 0;
        var rawDesc = news[i].excerpt;
        var desc = "";
        while(count < 150 && rawDesc[count] != undefined) {
          desc += rawDesc[count];
          count++;
        }
        desc += "...";
      } else {
        var desc = "";
      }

      newsContents += `
      <div class="news">
        <div class="image">
          <img src=${image} id="featured-image"/>
        </div> 
        <div class="content">
          <p>${source} • ${publishedDate}</p>
          <h3><a id="featured-header" href=${url} target="_blank">${title}</a></h3>
          <p id="featured-desc">${desc}</p>
        </div>
      </div>
    `;
    }
    document.querySelector('#featured-news').innerHTML = newsContents;
  }

  fetchFeaturedNews();

  //-------------------------------------------------------------------------------------------------------//

  // Modal to ask if U-Hub can use location. If not then you can enter a location

  window.onload = function() {
    var uhub = JSON.parse(localStorage.getItem("uhub"));
    if (uhub === null) {
      askLoc();
    } else {
      renderTasks();
      fetchWeather();
    }
  }

  function askLoc() {
    var modal = document.getElementById("askLocation");
    modal.style.display = "block";
  }

  document.getElementById("modalbtn").addEventListener("click", function(event){
    event.preventDefault();
    var btnClick2 = event.target.id;

    var uhub = {
      allowLocation: null,
      homeLocation: {
          city: '',
          state: '',
          lat: '',
          lon: ''
      },
      tasks: [],
      savedLocations: []
    };

    if(btnClick2 === "yes-button") {
      uhub.allowLocation = true;
      localStorage.setItem("uhub", JSON.stringify(uhub));
      renderTasks();
      doWeather();
    } else if (btnClick2 === "no-button") {
      uhub.allowLocation = false;
      localStorage.setItem("uhub", JSON.stringify(uhub));
      closeModal();
      renderTasks();
      searchLoc();
    }
  });

  function doWeather() {
    var modal = document.getElementById("askLocation");
    getIp();
    modal.style.display = "none";
  }

  function closeModal() {
    var modal = document.getElementById("askLocation");
    modal.style.display = "none";
  }

  function searchLoc() {
  var modal2 = document.getElementById("searchLocation");
  modal2.style.display = "block";
  }

  function closeSearchLocation() {
    var modal2 = document.getElementById("searchLocation");
    modal2.style.display = "none";
  }



  var submitButton = document.getElementById("subBtn")

  submitButton.addEventListener("click", function(event){
    event.preventDefault();
    var clickSubmit = event.target.id;
    var cityinput = document.getElementById("cityInput").value;

    if (clickSubmit === ("subBtn")){
      if (!cityinput){
        showErrorModal();
      } else {
        checkState();
      }
    }
  });


  var stateOption = document.getElementById("noOption")

  function checkState() {
    var cityInput = document.getElementById("cityInput").value;
    var stateSelect = document.getElementById("stateInput");
    var stateInput = document.getElementById("stateInput").value;
    
    var uhub = JSON.parse(localStorage.getItem("uhub"));
    
    var optionSelected = stateSelect.options[stateSelect.selectedIndex].value

    if(optionSelected != stateOption.value){
      uhub.homeLocation.city = cityInput;
      uhub.homeLocation.state = stateInput;
      localStorage.setItem("uhub", JSON.stringify(uhub));
      closeSearchLocation();
      fetchSearchLocation(cityInput, stateInput);
    } else {
      showErrorModal();
    }
  };


  // Error Modal

  function showErrorModal() {
    var modal3 = document.getElementById("searchError");
    modal3.style.display = "block";
  }

  var okayButton = document.getElementById("modalbtn3");

  okayButton.addEventListener("click", function(event){
    event.preventDefault;
    var btnclick = event.target.id;

    if (btnclick === "okayButton"){
      closeErrorModal();
    }
  });

  function closeErrorModal() {
    var modal3 = document.getElementById("searchError")
    modal3.style.display = "none";
  };

  // ------------REQUEST IP & GET WEATHER--------------
  // Fetch to the Api and runs function to store and slice it
  function getIp (){
    accessToken = "85cf430545fec4";
    ipUrl = "https://ipinfo.io/json?token=";
    
    fetch(ipUrl + accessToken)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            storeIp(data);
          });
        } else {
          fetchErrorModal(response.status + " - " + response.statusText);
        }
      })
      .catch(function (error) {
        fetchErrorModal(error);
      });
  }

  // Function to store and slice the response
  function storeIp(ip){
    var location = JSON.stringify(ip.loc);
    var city = JSON.stringify(ip.city);
    var state = JSON.stringify(ip.region);

    var uhub = JSON.parse(localStorage.getItem("uhub"));

    // Taking the quotes off the city name and storing it
    city = city.replace('"', "");
    city = city.replace('"', "");
    uhub.homeLocation.city = city;

    state = state.replace('"', "");
    state = state.replace('"', "");
    uhub.homeLocation.state = state;
    
    // Function to split then slice up the lat and lon
    var partOne = location.slice(0, location.length / 2);
    var partTwo = location.slice(location.length / 2, location.length);
    var partTwoCut = partTwo.replace(",", "");

    // Slice Lat
    if(partOne[1] === "-"){
      var newLat = partOne.slice(1, 7);
    } else {
      var newLat = partOne.slice(1, 6);
    }
    uhub.homeLocation.lat = newLat;

    // Slice Lon
    if(partTwoCut.startsWith("-")){
    var newLon = partTwoCut.slice(0, 6);
    } else if(partTwoCut.startsWith(",")){
    var newLon = partTwoCut.slice(1, 6);
    } else {
    var newLon = partTwoCut.slice(0, 5);
    }
    uhub.homeLocation.lon = newLon;
    localStorage.setItem("uhub", JSON.stringify(uhub));
    fetchWeather();
  }

  function fetchWeather() {
    var uhub = JSON.parse(localStorage.getItem("uhub"));
    // Getting lat and lon from localstorage to send into weather Api request
    var Latitude = uhub.homeLocation.lat;
    var Longitude = uhub.homeLocation.lon;

    // Fetch for the weather Api fill lat and lon
    fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + Latitude + "&lon=" + Longitude + "&appid=0f14b0df581c6adeaefe66badf8a8ffd&units=imperial")
    .then(function (response) {
      if(response.ok) {
        response.json().then(function (data) {
          renderWeather(data);
        });
      } else {
        fetchErrorModal(response.status + " - " + response.statusText);
      }
    })
    .catch(function (error) {
      fetchErrorModal(error);
    });
  }

  // Function to apply all data to the html
  function renderWeather(weather) {
    var uhub = JSON.parse(localStorage.getItem("uhub"));

    // Date
    var timeStamp = weather.dt;
    var day = new Date(timeStamp*1000);
    var date = (day.toDateString());
    var dateTag = document.getElementById("date");
    dateTag.textContent = date;
    
    // Adding city text and region to html header
    var cityName = document.getElementById("city1");
    cityName.textContent = uhub.homeLocation.city + (", ") + uhub.homeLocation.state + (".");

    // Temp text
    var temp = document.getElementById("temp");
    temp.textContent = weather.main.temp + ("°F");

    // Humidity
    var humidity1 = document.getElementById("humidity1");
    humidity1.textContent = weather.main.humidity + ("%");

    // Wind speed
    var windSpeed1 = document.getElementById("windspeed");
    windSpeed1.textContent = weather.wind.speed + (" Mph");
  }

  function fetchSearchLocation(city, state){
    var uhub = JSON.parse(localStorage.getItem("uhub"));

    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + state + "," + "US&appid=a68ad8fbcadf849a4a00973e9e0219b0")
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
      if(data.length < 1) {
        function searchLoc() {
          var modal2 = document.getElementById("searchLocation");
          modal2.style.display = "block";
        };
        function showErrorModal() {
          var modal3 = document.getElementById("searchError");
          modal3.style.display = "block";
        };
        searchLoc();
        showErrorModal();
      } else {
        uhub.homeLocation.city = city;
        uhub.homeLocation.state = state;
        uhub.homeLocation.lat = data[0].lat;
        uhub.homeLocation.lon = data[0].lon;
        localStorage.setItem("uhub", JSON.stringify(uhub));
        fetchWeather();
      };
    });
  };

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