document.addEventListener('DOMContentLoaded', function() {

var mediaKey = "f286b15dd5aad98f7c1fcef560feaaa2";

var newsImgEl = document.querySelectorAll('#news-image');
var newsSrcEl = document.querySelectorAll('#news-source');
var newsHeadEl = document.querySelectorAll('#news-header');
var newsDescEl = document.querySelectorAll('#news-desc');
var searchBtn = document.getElementById('search-btn');
var selectEl = document.getElementById('topic-select');
var defaultOptionEl = document.getElementById('default-option');

function submitHandler(event) {
  event.preventDefault();

  var cat = selectEl.options[selectEl.selectedIndex].value;

  if(cat != defaultOptionEl.value){
    fetchNews(cat);
  } else {
    console.log("Invalid");
  }
}

// Fetch request function for 
function fetchNews(cat) {
  var mediaUrl = "http://api.mediastack.com/v1/news?access_key=" + mediaKey + "&countries=us&languages=en&categories=" + cat + "&sort=popularity&limit=6";

  fetch(mediaUrl, {
    method: 'GET'
  })
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          renderNews(data.data)
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to API');
    });
}

function renderNews(news) {
  console.log(news);

  for(var i = 0; i < news.length; i++) {
    if(news[i].image) {
      newsImgEl[i].src = news[i].image;
    } else {
      newsImgEl[i].src = "./assets/images/default_news.jpeg";
    }
    if(news[i].author) {
      newsSrcEl[i].innerHTML = news[i].author;
      newsSrcEl[i].href = "https://" + news[i].author;
    } else {
      newsSrcEl[i].innerHTML = "Unknown";
      newsSrcEl[i].href = "";
    }
    if(news[i].title) {
      newsHeadEl[i].innerHTML = news[i].title;
    } else {
      newsHeadEl[i].innerHTML = "";
    }
    if(news[i].url) {
      newsHeadEl[i].href = news[i].url;
    } else {
      newsHeadEl[i].href = "";
    }
    if(news[i].description) {
      var count = 0;
      var description = news[i].description;
      var limitedDesc = "";
      while(count < 150 && description[count] != undefined) {
        limitedDesc += description[count];
        count++;
      }
      newsDescEl[i].innerHTML = limitedDesc + "...";
    } else {
      newsDescEl[i].innerHTML = "";
    }
  }
}

searchBtn.addEventListener("click", submitHandler)

});