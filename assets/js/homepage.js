document.addEventListener("DOMContentLoaded", () => {
	// Key for mediastack API
  var mediaKey = "877242f5effa43a7d5b13f42c4c74257";

	// Fetch request function
  function fetchFeaturedNews() {
		var mediaUrl = "http://api.mediastack.com/v1/news?access_key=" + mediaKey + "&countries=us&languages=en&sort=popularity&limit=2";

		fetch(mediaUrl)
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

	}

	// fetchFeaturedNews();

});