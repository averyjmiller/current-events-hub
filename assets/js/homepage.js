document.addEventListener("DOMContentLoaded", () => {
  var mediaKey = "877242f5effa43a7d5b13f42c4c74257";

  function renderFeaturedNews() {
		var mediaUrl = "http://api.mediastack.com/v1/news?access_key=" + mediaKey + "&sort=published_asc";
	}

	renderFeaturedNews();

});