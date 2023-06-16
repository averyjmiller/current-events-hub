document.addEventListener('DOMContentLoaded', function() {
  // ------------TASK MANAGER--------------
const taskDateElement = document.getElementById('task-date');
const date = new Date();
const dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
taskDateElement.textContent = dateString;

const tasksContainer = document.getElementById('tasks');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

tasks.sort((a, b) => b.priority - a.priority);

tasks.forEach((task, index) => {
  let taskCard = document.createElement('div');
  taskCard.className = "card mb-3";
  taskCard.style.color = "black";

  if(task.priority && !task.completed) {
    taskCard.style.backgroundColor = "red";
  } else if(task.completed) {
    taskCard.style.backgroundColor = "green";
  } else {
    taskCard.style.backgroundColor = "yellow";
  }

  taskCard.innerHTML = `
    <div class="card-body d-flex justify-content-between align-items-center">
      <i id="trash${index}" class="fas fa-trash"></i>
        ${task.text}
        <input id="check${index}" type="checkbox" ${task.completed ? "checked" : ""}>
    </div>
  `;

  tasksContainer.appendChild(taskCard);

  document.getElementById(`trash${index}`).addEventListener('click', function() {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    location.reload(); 
  });

  document.getElementById(`check${index}`).addEventListener('change', function() {
    tasks[index].completed = this.checked;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    location.reload();
  });
});

// ------------FEATURED NEWS--------------
// Key for mediastack API
var mediaKey = "f286b15dd5aad98f7c1fcef560feaaa2";

var featNewsImgEl = document.querySelectorAll('#news-image');
var featNewsSrcEl = document.querySelectorAll('#featured-source');
var featNewsHeadEl = document.querySelectorAll('#header-link');
var featNewsDescEl = document.querySelectorAll('#featured-desc');

// Fetch request function for 
function fetchFeaturedNews() {
  var mediaUrl = "http://api.mediastack.com/v1/news?access_key=" + mediaKey + "&countries=us&languages=en&sort=popularity&limit=2";

  fetch(mediaUrl, {
    method: 'GET'
  })
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          renderFeaturedNews(data.data)
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to API');
    });
}

function renderFeaturedNews(news) {
  console.log(news);

  for(var i = 0; i < news.length; i++) {
    if(news[1].image) {
      featNewsImgEl[i].src = news[i].image;
    } else {
      featNewsImgEl[i].src = "./assets/images/default_news.jpeg";
    }
    if(news[i].author) {
      featNewsSrcEl[i].innerHTML = news[i].author;
      featNewsSrcEl[i].href = "https://" + news[i].author;
    } else {
      featNewsSrcEl[i].innerHTML = "Unknown";
      featNewsSrcEl[i].href = "";
    }
    if(news[i].title) {
      featNewsHeadEl[i].innerHTML = news[i].title;
    } else {
      featNewsHeadEl[i].innerHTML = "";
    }
    if(news[i].url) {
      featNewsHeadEl[i].href = news[i].url;
    } else {
      featNewsHeadEl[i].href = "";
    }
    if(news[i].description) {
      var count = 0;
      var description = news[i].description;
      var limitedDesc = "";
      while(count < 150 && description[count] != undefined) {
        limitedDesc += description[count];
        count++;
      }
      featNewsDescEl[i].innerHTML = limitedDesc + "...";
    } else {
      featNewsDescEl[i].innerHTML = "";
    }
  }
}

// fetchFeaturedNews();

//-------------------------------------------------------------------------------------------------------//

// Modal to ask if U-Hub can use location. If not then you can enter a location

window.onload = function() {
  if (localStorage.getItem("Ask-Location") === null) {
    askLoc();
    localStorage.setItem("Ask-Location", true);
  } else {
    getIp();
  }
}

function askLoc() {
  var modal = document.getElementById("askLocation");
  modal.style.display = "block";
}

document.getElementById("modalbtn").addEventListener("click", function(event){
 event.preventDefault();
 var btnClick2 = event.target.id;

 if(btnClick2 === "yes-button") {
  doWeather();
 } else if (btnClick2 === "no-button") {
  closeModal();
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
 var modal2 = document.getElementById("searchLocation")
 modal2.style.display = "block";
}

function closeSearchLocation() {
  var modal2 = document.getElementById("searchLocation")
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
  var cityinput = document.getElementById("cityInput").value;
  var stateSelect = document.getElementById("stateInput");
  var stateInput = document.getElementById("stateInput").value;
  
  
  var optionSelected = stateSelect.options[stateSelect.selectedIndex].value

  if(optionSelected != stateOption.value){
    localStorage.setItem("City-Input", cityinput);
    localStorage.setItem("State-Input", stateInput);
    closeSearchLocation();
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



//------------------------------------------------------------------------------------------------------------//

// Token and Url for Ipinfo
var accessToken = "85cf430545fec4";
var ipUrl = "https://ipinfo.io/json?token=";

// Fetch to the Api and runs function to store and slice it
function getIp (){
  accessToken = "85cf430545fec4";
  ipUrl = "https://ipinfo.io/json?token=";

  fetch(ipUrl + accessToken).then(
    (response) => response.json()
  ).then(
    (jsonResponse) => (storeIp())
  )

}

// Function to store and slice the response
async function storeIp(){
  var response = await fetch(ipUrl + accessToken);
  var ip = await response.json();
  var location = JSON.stringify(ip.loc);
  var getCity = JSON.stringify(ip.city);
  

  sliceCity();
  // Taking the quotes off the city name and storing it
  function sliceCity(){
    getCity = getCity.replace('"', "");
    getCity = getCity.replace('"', "");
    localStorage.setItem("City", getCity);
  }
  
  // Function to split then slice up the lat and lon
  function cutIp(x){
   var partOne = x.slice(0, x.length / 2);
   var partTwo = x.slice(x.length / 2, x.length);
   var partTwoCut = partTwo.replace(",", "");

    // Slice Lat
    if(partOne[1] === "-"){
      var newLat = partOne.slice(1, 7);
      localStorage.setItem("Latitude", newLat);
    } else {
      var newLat = partOne.slice(1, 6);
      localStorage.setItem("Latitude", newLat);
    }
  
   // Slice Lon
   if(partTwoCut.startsWith("-")){
    var newLon = partTwoCut.slice(0, 6);
    localStorage.setItem("Longitude", newLon);
   } else if(partTwoCut.startsWith(",")){
    var newLon = partTwoCut.slice(1, 6);
    localStorage.setItem("Longitude", newLon);
   } else {
    var newLon = partTwoCut.slice(0, 5);
    localStorage.setItem("Longitude", newLon);
   }
  }

  cutIp(location);

  // Getting lat and lon from localstorage to send into weather Api request
  var Latitude = localStorage.getItem("Latitude");
  var Longitude = localStorage.getItem("Longitude");

  // Fetch for the weather Api fill lat and lon
  fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + Latitude + "&lon=" + Longitude + "&appid=0f14b0df581c6adeaefe66badf8a8ffd&units=imperial")
   .then(function (response) {
    return response.json();
   })
   .then(function (data) {
    localStorage.setItem("Weather", JSON.stringify(data));
    renderWeather(ip);
   })   
}

// Function to apply all data to the html
function renderWeather(ip) {
     // Parsing Weather object
     var getWeather = JSON.parse(localStorage.getItem("Weather"));

     // Date
     var timeStamp = getWeather.dt;
     var day = new Date(timeStamp*1000);
     var date = (day.toDateString());
     var dateTag = document.getElementById("date");
     dateTag.textContent = date;
  
     // Region (State)
     var region = ip.region;
     
     // Adding city text and region to html header
     var newCity = localStorage.getItem("City");
     var cityName = document.getElementById("city1");
     cityName.textContent = newCity + (", ") + region + (".");
  
     // Temp text
     var temp = document.getElementById("temp");
     temp.textContent = getWeather.main.temp + ("°F");
  
     // Humidity
     var humidity1 = document.getElementById("humidity1");
     humidity1.textContent = getWeather.main.humidity + ("%");
  
     // Wind speed
     var windSpeed1 = document.getElementById("windspeed");
     windSpeed1.textContent = getWeather.wind.speed + (" Mph");
}

 //getIp();

});

// Clicking cards to go to weather
function cardClick() {
  window.location.href = "weather.html";
}

