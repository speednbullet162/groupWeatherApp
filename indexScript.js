//https://api.weather.gov/points/{latitude},{longitude}/forecast
// https://api.opencagedata.com/geocode/v1/json?countrycode=us&language=en&key=af889da021e446039ee3e086726a48bf&q={string}
// https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={api_key}

// letiables
const wOutput = document.getElementById('weatherInfo-container');
const nswURL = 'https://api.weather.gov/points/';
let nswEnd, urlCall;
let wInfo;
const cageURL = 'https://api.opencagedata.com/geocode/v1/json?countrycode=us&language=en&key=af889da021e446039ee3e086726a48bf&q=';
let locationSearch, cageData, temp, tempLat, tempLng, lat, lng, icon, name, forecast, temperature, windspeed, winddir, input;
const searchBox = document.getElementById('city');
const mapURL = 'https://tile.openweathermap.org/map/';
const mapKey = '04a196545fad87f2f48af41914dfdeb1';
const mOutput = document.getElementById('map');
let layer, zoom, xCord, yCord;

//event listeners
document.getElementById('nsw').addEventListener('click', readInput);
document.getElementById('city').addEventListener('keyup', function(event) {
	if (event.keyCode === 13) {
		document.getElementById('nsw').click();
	}
});

// *************************************|| National weather service api ||*******************************************
//https://api.weather.gov/points/{latitude},{longitude}/forecast

function retrieveNSW(search) {
	console.log('%c retrieve nation weather service called', 'color: #a8ffff');
	urlCall = nswURL + search + '/forecast';
	console.log('nsw url: ', urlCall);
	const nsw = new XMLHttpRequest();
	nsw.open('GET', urlCall, true);

	nsw.onload = function() {
		//if the data is retrieved
		console.log('nsw search points: ', search);
		console.log('nsw status: ', this.status);
		if (this.status == 200) {
			console.log('National weather information: ', JSON.parse(this.responseText));
			wInfo = JSON.parse(this.responseText);

			//display the weather forecast
			wOutput.innerHTML = '';
			for (let i = 0; i < wInfo.properties.periods.length; i++) {
				icon = wInfo.properties.periods[i].icon;
				name = wInfo.properties.periods[i].name;
				forecast = wInfo.properties.periods[i].shortForecast;
				temperature = wInfo.properties.periods[i].temperature;
				windspeed = wInfo.properties.periods[i].windSpeed;
				winddir = wInfo.properties.periods[i].windDirection;
				wOutput.innerHTML += `<div class='weatherInfo'>
						<img src='${icon}' alt='Weather Icon' style="display: block; margin: auto;">
						<h2 style="text-align: center;">${name} Forecast</h2>
						<p>Conditions: ${forecast}</p>
						<p>Temperature: ${temperature}&#176;F</P>
						<p>Wind: ${windspeed} ${winddir}</p>
                    </div>
                `;
			}
			console.log('%c weather information completed', 'color: #a8ffff');
		}
		//if the data is not found
		if (this.status == 404) {
			alert('National Weather Service: \nthis location was not found in the weather database');
		}
	};
	nsw.send();
}

// ********************************************|| Open Cage Geocoding api ||***************************************************
// https://api.opencagedata.com/geocode/v1/json?countrycode=us&language=en&key={apikey}&={string}

//get city location
function getLocation(given) {
	console.log('%c open cage get location called', 'color: #a8ffff');
	//get input from user
	if (input != '') {
		locationSearch = cageURL + given;
		console.log('location url: ', locationSearch);
	}

	//call api
	const openCage = new XMLHttpRequest();
	openCage.open('GET', locationSearch, true);
	// body > div.site-section > div

	openCage.onload = function() {
		//return status is good take the data
		if (this.status == 200) {
			cageData = JSON.parse(this.responseText);
		}
		console.log('cage data: ', cageData);
		//if more than 1 result, have user select which one
		if (cageData.results.length > 1) {
			wOutput.innerHTML = `<div class='center'>Sorry did you mean:</div>`;
			for (let i = 0; i < cageData.results.length; i++) {
				temp = JSON.stringify(cageData.results[i].formatted);
				tempLat = cageData.results[i].geometry.lat;
				tempLng = cageData.results[i].geometry.lng;
				tempLocation = tempLat + ',' + tempLng;
				wOutput.innerHTML += `
				<div class='did-contain'>
					<button class='didButton' id='didUMean' value='${tempLocation}' onclick='retrieveNSW(this.value)'>${temp}</button>
				</div>
				`;
			}
			input = '';
			console.log('%c did you mean complete', 'color: #a8ffff');
		}
		else if (cageData.results.length == 0) {
			alert(
				'something went wrong with the location api:\n' +
					'Location api is free so location tracking/searching is not as accurate as google. Please keep this in mind if you get an error searching for your city',
			);
		}
		else {
			//else give data to weather api
			lat = cageData.results[0].bounds.northeast.lat;
			lng = cageData.results[0].bounds.northeast.lng;
			xMer = cageData.results[0].annotations.Mercator.x;
			yMer = cageData.results[0].annotations.Mercator.y;
			console.log('lat, lng: ', lat, ',', lng);
			console.log('x, y mercator', xMer, ',', yMer);
			nswEnd = lat + ',' + lng;
			retrieveNSW(nswEnd);
			// getMap();
			console.log('%c finished passing location information', 'color: #a8ffff');
		}
	};
	openCage.send();
}

// ********************************************|| Open Weather Map api ||***************************************************
//https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={api_key}

// function getMap() {
// 	console.log('%c get map function called', 'color: #a8ffff');
// 	zoom = 10;
// 	xCord = 256 / 2 * Math.PI * Math.pow(2, zoom) * (xMer + Math.PI) * 256.0; //{pixels}
// 	yCord = 256 / 2 * Math.PI * Math.pow(2, zoom) * (Math.PI - Math.log(Math.tan(Math.PI / 4 + yMer / 2))) * 256.0; //{pixels}
// 	console.log('x cord: ', xCord);
// 	console.log('y cord: ', yCord);

// 	layer = 'temp_new';
// 	mapCall = mapURL + layer + '/' + zoom + '/' + xCord + '/' + yCord + '.png?appid=' + mapKey;
// 	console.log('map url: ', mapCall);
// 	const openWeather = new XMLHttpRequest();
// 	openWeather.open('GET', mapCall, true);
// 	openWeather.onload = function() {
// 		console.log('openweather status: ', this.status);
// 		if (this.status == 200) {
// 			// console.log('openweather responsetext: ', this.responseText);
// 			// console.log('openweather response: ', this.response);
// 			mOutput.innerHTML = `<div><img src='${this.responseText}'>response text ${this.responseText} :::::::: response ${this
// 				.response}</div>`;
// 			console.log('%c weather map call complete', 'color: #a8ffff');
// 		}
// 	};
// 	openWeather.send();
// }

function readInput() {
	input = searchBox.value;
	//remove space after comma in search
	input = input.replace(',/s/g', ',');
	wOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
	let forecastTitleUpdate = document.getElementById('forecast_title');
	forecastTitleUpdate.innerHTML = 'Weather Forecast for ' + input;
	getLocation(input);
	console.log('%c finished reading input', 'color: #a8ffff');
}
