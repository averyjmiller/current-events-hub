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

