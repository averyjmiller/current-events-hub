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

  // Token and Url 
var accessToken = "85cf430545fec4"
var ipUrl = "https://ipinfo.io/json?token="

// Fetch to the Api and runs function to store and slice it
function getIp (){

  fetch(ipUrl + accessToken).then(
    (response) => response.json()
  ).then(
    (jsonResponse) => (storeIp())
  )

}

// Function to store and slice the response
async function storeIp(){
  var response = await fetch(ipUrl + accessToken)
  var ip = await response.json();
  var location = JSON.stringify(ip.loc)
  var getCity = JSON.stringify(ip.city)

  sliceCity();
  // Taking the quotes off the city name and storing it
  function sliceCity(){
    getCity = getCity.replace('"', "")
    getCity = getCity.replace('"', "")
    localStorage.setItem("City", getCity)
  }
  
  // Function to split then slice up the lat and lon
  function cutIp(x){
   var partOne = x.slice(0, x.length / 2)
   var partTwo = x.slice(x.length / 2, x.length)
   var partTwoCut = partTwo.replace(",", "")
   console.log(partOne)
   console.log(partTwoCut)

    // Slice Lat
    if(partOne[1] === "-"){
      var newLat = partOne.slice(1, 7)
      localStorage.setItem("Latitude", newLat)
      console.log(newLat)
    } else {
      var newLat = partOne.slice(1, 6)
      localStorage.setItem("Latitude", newLat)
      console.log(newLat)
    }
  
   // Slice Lon
   if(partTwoCut.startsWith("-")){
    var newLon = partTwoCut.slice(0, 6);
    localStorage.setItem("Longitude", newLon)
    console.log(newLon);
   } else if(partTwoCut.startsWith(",")){
    var newLon = partTwoCut.slice(1, 6);
    localStorage.setItem("Longitude", newLon)
    console.log(newLon);
   } else {
    var newLon = partTwoCut.slice(0, 5);
    localStorage.setItem("Longitude", newLon)
    console.log(newLon);
   }

   return console.log(newLat+ " " + newLon);

  }

  cutIp('"-39.5401,-82.4071"');

  // Getting lat and lon from localstorage to send into weather Api request
  var Latitude = localStorage.getItem("Latitude")
  console.log(Latitude)
  var Longitude = localStorage.getItem("Longitude")
  console.log(Longitude)

  fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + Latitude + "&lon=" + Longitude + "&appid=0f14b0df581c6adeaefe66badf8a8ffd")
   .then(function (response) {
    return response.json();
   })
   .then(function (data) {
    localStorage.setItem("Weather", JSON.stringify(data))
   })
   
   var newCity = localStorage.getItem("City")
   var getWeather = JSON.parse(localStorage.getItem("Weather"))
   console.log(getWeather)
   console.log(newCity)
}

getIp();



});

