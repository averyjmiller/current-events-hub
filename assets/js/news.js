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
  var lastWeek = dayjs(today).subtract(7, 'day').format('YYYY-MM-DD');

  var mediaUrl = "http://api.mediastack.com/v1/news?" + 
  "access_key=" + mediaKey + 
  "&countries=us" +
  "&languages=en" + 
  "&sources=" + sources +
  "&categories=" + cat +
  "&date=" + lastWeek + ',' + today +
  "&sort=published_desc" +
  "&limit=30";

  fetch(mediaUrl, {
    method: 'GET'
  })
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          renderNews(cat, data.data);
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

  var numberOfPages = Math.ceil(news.length / 6);

  renderPageBtns(numberOfPages);
  renderPage(1, news);

  document.getElementById('pageBtn-container').addEventListener("click", function(event){
    event.preventDefault();

    var pageClicked = parseInt(event.target.id);
    renderPage(pageClicked, news);
  });

}

function renderPageBtns(pages) {
  document.querySelector('#pageBtn-container').innerHTML = ``;

  for(var i = 1; i <= pages; i++) {
    document.querySelector('#pageBtn-container').innerHTML += `
    <button class="page-btn" id="${i}">${i}</div>
    `;
  }
}

function renderPage(page, news) {

  var start = (page * 6) - 6;
  var end = page * 6;

  var pageContents= ``;

  for(var i = start; i < end && news[i] != undefined ; i++) {
    if(news[i].image) {
      var image = news[i].image;
    } else {
      var image = "./assets/images/default_news.jpeg";
    }
    if(news[i].source) {
      var source = news[i].source;
    } else {
      var source = "Unknown";
    }
    if(news[i].published_at) {
      var publishedDate = news[i].published_at.slice(0, 10).split("-");
      publishedDate = publishedDate[1] + "/" + publishedDate[2] + "/" + publishedDate[0];
    } else {
      var publishedDate = "Unknown";
    }
    if(news[i].title) {
      var title = news[i].title;
    } else {
      var title = "";
    }
    if(news[i].url) {
      var url = news[i].url;
    } else {
      var url = "";
    }
    if(news[i].description) {
      var count = 0;
      var rawDesc = news[i].description;
      var desc = "";
      while(count < 150 && rawDesc[count] != undefined) {
        desc += rawDesc[count];
        count++;
      }
      desc += "...";
    } else {
      var desc = "";
    }
  
    pageContents += `
      <div class="news">
        <div class="image">
          <img src=${image} id="news-image"/>
        </div> 
        <div class="content">
          <p>${source} • ${publishedDate}</p>
          <h2><a id="news-header" href=${url} target="_blank">${title}</a></h2>
          <p id="news-desc">${desc}</p>
        </div>
      </div>
    `;
  }

  document.querySelector('.news-info').innerHTML = pageContents;

}

searchBtn.addEventListener("click", submitHandler);

});