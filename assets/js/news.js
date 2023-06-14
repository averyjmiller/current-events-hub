document.addEventListener('DOMContentLoaded', function() {

var mediaKey = "f286b15dd5aad98f7c1fcef560feaaa2";

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
  var sources = "cnn,nytimes,espn,cbs,msnbc,fox,tmz,bbc";
  var today = dayjs().format('YYYY-MM-DD');
  var yesterday = dayjs(today).subtract(1, 'day').format('YYYY-MM-DD');

  var mediaUrl = "http://api.mediastack.com/v1/news?" + 
  "access_key=" + mediaKey + 
  "&countries=us&languages=en" + 
  "&sources=" + sources +
  "&categories=" + cat +
  "&date=" + yesterday + ',' + today +
  "&sort=popularity&limit=6";

  fetch(mediaUrl, {
    method: 'GET'
  })
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          renderNews(cat, data.data)
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to API');
    });
}

function renderNews(cat, news) {
  console.log(news);

  cat = cat.charAt(0).toUpperCase() + cat.slice(1) + " News";

  document.getElementById('topic-header').innerHTML = cat;
  document.querySelector('.news-info').innerHTML = "";

  var image;
  var source;
  var publishedDate;
  var title;
  var url;
  var rawDesc;
  var desc;

  for(var i = (news.length-1); i >= 0; i--) {

    if(news[i].image) {
      image = news[i].image;
    } else {
      image = "./assets/images/default_news.jpeg";
    }
    if(news[i].source) {
      source = news[i].source;
    } else {
      source = "Unknown";
    }
    if(news[i].published_at) {
      publishedDate = news[i].published_at.slice(0, 10).split("-");
      publishedDate = publishedDate[1] + "/" + publishedDate[2] + "/" + publishedDate[0];
    } else {
      publishedDate = "Unknown";
    }
    if(news[i].title) {
      title = news[i].title;
    } else {
      title = "";
    }
    if(news[i].url) {
      url = news[i].url;
    } else {
      url = "";
    }
    if(news[i].description) {
      var count = 0;
      rawDesc = news[i].description;
      desc = "";
      while(count < 150 && rawDesc[count] != undefined) {
        desc += rawDesc[count];
        count++;
      }
      desc += "...";
    } else {
      desc = "";
    }

    document.querySelector('.news-info').innerHTML += `
      <div class="news">
        <div class="image">
          <img src=${image} id="news-image"/>
        </div> 
        <div class="content">
          <p>${source} • ${publishedDate}</p>
          <h2><a id="news-header" href="" target="_blank">${title}</a></h2>
          <p id="news-desc">${desc}</p>
        </div>
      </div>
    `;
  }
}

searchBtn.addEventListener("click", submitHandler)

});