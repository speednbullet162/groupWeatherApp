//https://api.weather.gov/points/33.886823,-84.28956/forecast

// variables
const wOutput = document.getElementById('weatherInfo');
const nswURL = 'https://api.weather.gov/points/';
var nswEnd, urlCall;
var wInfo;
const cageURL = 'https://api.opencagedata.com/geocode/v1/json?countrycode=us&language=en&key=af889da021e446039ee3e086726a48bf&q=';
var locationSearch, cageData, temp, tempLat, tempLng, lat, lng, name, forecast, temperature, windspeed, winddir, input;
const searchBox = document.getElementById('city');

//event listeners
document.getElementById('nsw').addEventListener('click', readInput);
document.getElementById('city').addEventListener('keyup', function(event) {
	if (event.keyCode === 13) {
		document.getElementById('nsw').click();
	}
});

// *************************************|| National weather service api ||*******************************************
function retrieveNSW(search) {
	urlCall = nswURL + search + '/forecast';
	console.log('nsw url: ', urlCall);
	const nsw = new XMLHttpRequest();
	nsw.open('GET', urlCall, true);

	nsw.onload = function() {
		console.log('nsw status: ', this.status);
		//if the data is retrieved
		if (this.status == 200) {
			console.log('NSW good');
			// console.log(JSON.parse(this.responseText));
			wInfo = JSON.parse(this.responseText);

			//display the weather forecast
			wOutput.innerHTML = '';
			for (var i = 0; i < wInfo.properties.periods.length; i++) {
				name = wInfo.properties.periods[i].name;
				forecast = wInfo.properties.periods[i].shortForecast;
				temperature = wInfo.properties.periods[i].temperature;
				windspeed = wInfo.properties.periods[i].windSpeed;
				winddir = wInfo.properties.periods[i].windDirection;
				wOutput.innerHTML += `<div>
                        ${name} forecast: ${forecast} @ ${temperature} wind: ${windspeed} ${winddir}
                    </div>
                `;
			}
		}
		//if the data is not found
		if (this.status == 404) {
			alert('this was not found');
		}
	};
	nsw.send();
}

// ********************************************|| Getting location ||***************************************************
//get city location
function getLocation(given) {
	//get input from user
	if (input != '') {
		locationSearch = cageURL + input;
	}

	//call api
	const openCage = new XMLHttpRequest();
	openCage.open('GET', locationSearch, true);
	openCage.onload = function() {
		//return status is good take the data
		if (this.status == 200) {
			cageData = JSON.parse(this.responseText);
		}
		console.log('cage data: ', cageData);

		//if more than 1 result, have user select which one
		if (cageData.results.length > 1) {
			wOutput.innerHTML = `<div>Sorry did you mean:</div>`;
			for (var i = 0; i < cageData.results.length; i++) {
				temp = JSON.stringify(cageData.results[i].formatted);
				tempLat = cageData.results[i].geometry.lat;
				tempLng = cageData.results[i].geometry.lng;
				tempLocation = tempLat + ',' + tempLng;
				wOutput.innerHTML += `<li><button id='didUMean' value='${tempLocation}' onclick='retrieveNSW(this.value)'>${temp}</button></li>`;
			}
			input = '';
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
			nswEnd = lat + ',' + lng;
			retrieveNSW(nswEnd);
		}
	};
	openCage.send();
}

function readInput() {
	input = searchBox.value;
	input = input.replace(/\s/g, '');
	getLocation(input);
}
