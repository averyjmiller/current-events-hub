document.addEventListener("DOMContentLoaded", () => {
  var mediaKey = "877242f5effa43a7d5b13f42c4c74257";

  function renderFeaturedNews() {
		var mediaUrl = "http://api.mediastack.com/v1/news?access_key=" + mediaKey + "&sort=popularity";

		fetch(mediaUrl)
			.then(function (response) {
				if (response.ok) {
          response.json().then(function (data) {
            console.log(data);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to API');
			});
	}

	renderFeaturedNews();

});