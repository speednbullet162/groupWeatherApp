//variables
let url = 'https://api.weather.gov/points/33.886823,-84.28956';
const testing = 1 + 2 - 1;

// search
$('#search-box').keydown(function(event) {
	var keyCode = event.keyCode ? event.keyCode : event.which;
	if (keyCode == 13) {
		$('#search').trigger('click');
	}
});
$('#search').click(function() {
	searchData = $('#search-box').val();
	preSearch = searchData;
	if (searchData === '' || searchData === null) {
		//log when nothing was input
		console.log('nothing was input');
		alert('You forgot to give us your input');
	}
	else {
		//take input from search bar and input the results to google api
		console.log('search Data: ', searchData);
		console.log(url);
	}
});

$.ajax({
	url: bookURL + searchData + pageLenURL + pageIndex, //add input to end of api url
	dataType: 'JSON',
	success: function(res) {
		console.log(res);
		if (res.totalItem === 0) {
			//if no results inform user
			alert('looks like there nothing with that name \nTry Again');
		}
		else {
			// show the resutls to the user
			$('.results').css('visibility', 'visible');
			$('.searchBanner').css('visibility', 'visible');
			displayResults(res);
			pageCount.innerHTML = 'Current Page ' + String(pageNum);
		}
	},

	//alert the user if the api doesnt work
	error: function() {
		alert('Something went wrong');
	},
});
