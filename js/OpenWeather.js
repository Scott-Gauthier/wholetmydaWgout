//global variables
const mainDate = moment().format("MMM Do, YYYY");
var locationentered = JSON.parse(localStorage.getItem("textEntered")) || [];

//function to make sure only one checkbox can be selected at a time
$(document).ready(function(){
  $('.check').click(function() {
      $('.check').not(this).prop('checked', false);
  });
});

//function to grab user inputs such as location radius, pet criteria and the city name
function mainTask() {
$("#cityInputSubmit").on("click", () => {
  let selectedRadius = $("select").val();
  let cityName;
  let locationentered = JSON.parse(localStorage.getItem("textEntered")) || [];

  //checking to see what the user checked for pet preference
    if ($('#checkbox1').prop('checked')) {
             searchTerm = 'Dog Training';
    }
    if ($('#checkbox2').prop('checked')) {
             searchTerm = 'Veterinarian';
    }
    if ($('#checkbox3').prop('checked')) {
             searchTerm = 'Pet Store';
    }
    if ($('#checkbox4').prop('checked')) {
             searchTerm = 'Dog Park';
    }
        //local storage variables
        cityName = $("#cityInput").val();
        const Object = {
          City: `${cityName}`,
          Radius: selectedRadius,
          MapItem: searchTerm,
        }
        locationentered.push(Object);
        localStorage.setItem("textEntered", JSON.stringify(locationentered));
        console.log(locationentered);
        //Add stored list
        citylistMain(selectedRadius, cityName, searchTerm);
        //update map and weather
        mapweatherTask(selectedRadius, cityName, searchTerm);
})};
// function to use openweather MAP
function mapweatherTask(selectedRadius, cityName, searchTerm) {
  const weatherEl = document.getElementById("testVar");
      weatherEl.style.display = "none";
  const apiKey = "&appid=9f103066ad2690dfc98026104a1b9e25"
  // let cityname;
    const URL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + apiKey+ "&units=imperial";
    $.ajax({
        url: URL,
        method: "GET" 
//grabs data from Openweather API and puts it variables to use 
}).then(function(response){
  weatherEl.style.display = "block";
    const {icon} = response.weather[0]
    const {speed} = response.wind;
    const {temp} = response.main;
    const {name} = response;
    //add the variables from OPEN weather to the webpage
    $("#weatherForCity").text(name);
    $('#weatherIcon').attr("src",'https://openweathermap.org/img/wn/'+ icon +'.png')
    $('#windSpeed').text(speed+" MPH");
    $("#currentTemp").text(temp + "°F");

    let lat = response.coord.lat;
    let long = response.coord.lon;
    let map;
    let service;
    let infowindow; 
    // fuction to use GOOGLE Maps API, using variables from weather API
    function initMap() {
        let geoLocation = new google.maps.LatLng(lat, long);
        infowindow = new google.maps.InfoWindow();
        map = new google.maps.Map(
            document.getElementById('map'), {center: geoLocation, zoom: 13});
        let request = {
          location: geoLocation,
          radius: selectedRadius,
          query: searchTerm,
        };
        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback);
      }
      //running google map api function
      initMap();
      //function to check if marker has already been placed 
      function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            let place = results[i];
            createMarker(results[i]);
          }
        }
      }
      //function to place markers on the map produced from google API
      function createMarker(place) {
          new google.maps.Marker({
              position: place.geometry.location,
              map: map
          });
      }
})
};

mainTask();
//function to post the local storage variables to screen 
function citylistMain(selectedRadius, cityName, searchTerm) {
    //Clear list
    function removeAllChildNodes(parent) {
      while (parent.firstChild) {
          parent.removeChild(parent.firstChild);
      }
    } 
    const citylist = document.querySelector('#citylist');
    removeAllChildNodes(citylist);

    //Create new list with the users chosen city
    locationentered = JSON.parse(localStorage.getItem("textEntered"));
    if (!locationentered) {
    } else {
    for (let i = 0; i < locationentered.length; i++) { 
      let citylistEL = document.getElementById("citylist"); // container to place searched city name
      let div = document.createElement("div");
      let spanRefresh = document.createElement("span");
      let spanClose   = document.createElement("span");
      let iFA = document.createElement("i");
      let divChild1 = document.createElement("div");
      let divChild2 = document.createElement("div");
      let divChild3 = document.createElement("div");
      let divChild4 = document.createElement("div");
      citylistEL.append(div);
      div.setAttribute("class","grid-x");
      div.setAttribute("id",`row${i}`);
      let citylistRowEL = document.getElementById(`row${i}`);
      citylistRowEL.append(divChild1);
      divChild1.setAttribute("class","cell small-1");
      divChild1.append(iFA);
      iFA.setAttribute("Class","fa-solid fa-paw")
      citylistRowEL.append(divChild2);
      divChild2.setAttribute("class","cell small-9");
      divChild2.textContent = `City: ${Object.values(locationentered[i])[0]}, Radius: ${(Object.values(locationentered[i])[1]/1609.344).toFixed(0)} miles, MapItem: ${Object.values(locationentered[i])[2]}`;
      citylistRowEL.append(divChild3);
      divChild3.setAttribute("class","cell small-1");
      divChild3.append(spanRefresh);
      spanRefresh.setAttribute("class","material-symbols-outlined");
      spanRefresh.setAttribute("id",`refresh${i}`);
      spanRefresh.textContent = " refresh "; //
      citylistRowEL.append(divChild4);
      divChild4.setAttribute("class","cell small-1");
      divChild4.append(spanClose);
      spanClose.setAttribute("class","material-symbols-outlined");
      spanClose.setAttribute("id",`close${i}`);
      spanClose.textContent = " close ";

      document.querySelector(`#refresh${i}`).addEventListener("click", function(event) {
        event.preventDefault();
        cityName = Object.values(locationentered[i])[0];
        selectedRadius = Object.values(locationentered[i])[1];
        searchTerm = Object.values(locationentered[i])[2];
        mapweatherTask(selectedRadius, cityName, searchTerm);
      });
      document.querySelector(`#close${i}`).addEventListener("click", function(event) {
        event.preventDefault();
        function removeAllChildNodes(parent) {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
              }
            }
          let row = document.querySelector(`#row${i}`);
          removeAllChildNodes(row);
          row.remove();
          locationentered.splice(i,1);
          localStorage.setItem("textEntered", JSON.stringify(locationentered));
          citylistMain();
      }); 
    }
  }
};
citylistMain();