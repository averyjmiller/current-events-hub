document.addEventListener('DOMContentLoaded', function() {

var searchBtn = document.getElementById('search-btn');
var selectEl = document.getElementById('topic-select');
var defaultOptionEl = document.getElementById('default-option');

function submitHandler(event) {
  event.preventDefault();

  var cat = selectEl.options[selectEl.selectedIndex].value;

  if(cat != defaultOptionEl.value){
    fetchNews(cat);
  }
}

function fetchNews(cat) {

  var url = "https://api.newscatcherapi.com/v2/latest_headlines?" +
  "countries=US" +
  "&lang=en" +
  "&topic=" + cat +
  "&when=7d" +
  "&page_size=30";
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
          renderNews(cat, data.articles);
        });
      } else {
        fetchErrorModal(response.status + " - " + response.statusText);
      }
    })
    .catch(function (error) {
      fetchErrorModal(error);
    });
}

function renderNews(cat, news) {
  if(cat != 'news') {
    cat = cat.charAt(0).toUpperCase() + cat.slice(1) + " News";
  } else {
    cat = "General News";
  }

  document.getElementById('topic-header').innerHTML = cat;
  document.querySelector('.news-info').innerHTML = "";

  var numberOfPages = Math.ceil(news.length / 6);

  renderPageBtns(numberOfPages);
  renderPage(1, news);

  document.getElementById('pageBtn-container').addEventListener("click", function(event){
    event.preventDefault();

    var btnClicked = event.target;
    
    if(btnClicked.nodeName == 'BUTTON') {
      renderPageBtns(numberOfPages);
      var pageNumber = parseInt(btnClicked.id);
      renderPage(pageNumber, news);
    }
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
    if(news[i].media) {
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
  
    pageContents += `
      <div class="news">
        <div class="image">
          <img src=${image} id="news-image"/>
        </div> 
        <div class="content">
          <p>${source} • ${publishedDate}</p>
          <h3><a id="news-header" href=${url} target="_blank">${title}</a></h3>
          <p id="news-desc">${desc}</p>
        </div>
      </div>
    `;
  }

  document.querySelector('.news-info').innerHTML = pageContents;

  document.getElementById(JSON.stringify(page)).classList.add('selected-page');

}

searchBtn.addEventListener("click", submitHandler);

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