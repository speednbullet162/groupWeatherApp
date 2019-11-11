//https://api.weather.gov/points/33.886823,-84.28956/forecast

// variables
const wOutput = document.getElementById('weatherInfo');
const nswURL = 'https://api.weather.gov/points/';
var nswEnd, urlCall;
var wInfo;
const cageURL = 'https://api.opencagedata.com/geocode/v1/json?language=en&key=af889da021e446039ee3e086726a48bf&q=';
var input, locationSearch, cageData, temp, lat, lng, name, forecast, temperature, windspeed, winddir;

//event listeners
document.getElementById('nsw').addEventListener('click', getLocation);
document.getElementById('city').addEventListener('keyup', function(event) {
	if (event.keyCode === 13) {
		document.getElementById('nsw').click();
	}
});

// *************************************|| National weather service api ||*******************************************
function retriveNSW(search) {
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
function getLocation() {
	//get input from user
	console.log('inside the function');
	input = document.getElementById('city').value;
	locationSearch = cageURL + input;

	//call api
	const openCage = new XMLHttpRequest();
	openCage.open('GET', locationSearch, true);
	openCage.onload = function() {
		//return status is good take the data
		if (this.status == 200) {
			cageData = JSON.parse(this.responseText);
		}
		console.log(cageData);

		//if more than 1 result, have user select which one
		if (cageData.results.length > 1) {
			wOutput.innerHTML = `<div>Sorry did you mean:</div><ol>`;
			for (var i = 0; i < cageData.results.length; i++) {
				temp = JSON.stringify(cageData.results[i].formatted);
				wOutput.innerHTML += `<li>${temp}</li>`;
			}
			wOutput.innerHTML += `</ol>`;
		}
		else {
			//else give data to weather api
			lat = cageData.results[0].bounds.northeast.lat;
			lng = cageData.results[0].bounds.northeast.lng;
			nswEnd = lat + ',' + lng;
			retriveNSW(nswEnd);
		}
	};
	openCage.send();
}
