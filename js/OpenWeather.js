
var weatherEl = document.getElementById("testVar");
weatherEl.style.display = "none";

$(document).ready(function(){
  $('.check').click(function() {
      $('.check').not(this).prop('checked', false);
  });
});

const apiKey = "&appid=9f103066ad2690dfc98026104a1b9e25"
const mainDate = moment().format("MMM Do, YYYY");


$("#cityInputSubmit").on("click", () => {
  weatherEl.style.display = "block";
  selectedRadius = $("select").val(); 

  console.log(selectedRadius);

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
    console.log(searchTerm)
    const cityName = $("#cityInput").val();
    $("#cityInput").val("");
    const URL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + apiKey+ "&units=imperial"
    const queryURLforcast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=ecc0be5fd92206da3aa90cc41c13ca56";
    $.ajax({
        url: URL,
        method: "GET" 

}).then(function(response){
  console.log(response.main.temp)
    console.log(response.weather)
    console.log(response.coord);
    console.log(URL);
    var cityNameEl = $("<h2>").text(response.name);
    var displayMainDate = cityNameEl.append(" " + mainDate);
    var tempEL = $("<p>").text("Temperture: " + response.main.temp);
    var humEl = $("<p>").text("Humidity: " + response.main.humidity);
    var currentweather = response.weather[0].main;
    const {icon} = response.weather[0]
    const {speed} = response.wind;
    const {temp} = response.main;
    const {name} = response;
    $("#weatherForCity").text(name);
    $('#weatherIcon').attr("src",'https://openweathermap.org/img/wn/'+ icon +'.png')
    $('#windSpeed').text(speed+" MPH");
    $("#currentTemp").text(temp + "°F");

    
   

    var lat = response.coord.lat;
    var long = response.coord.lon;
    

    var map;
    var service;
    var infowindow; 
    
    function initMap() {
        var geoLocation = new google.maps.LatLng(lat, long);
      
        infowindow = new google.maps.InfoWindow();
      
        map = new google.maps.Map(
            document.getElementById('map'), {center: geoLocation, zoom: 13});
      
        var request = {
          location: geoLocation,
          radius: selectedRadius,
          query: searchTerm,
        };
      
        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback);
      }

      initMap();
      
      function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            var place = results[i];
            createMarker(results[i]);
          }
        }
      }
      
      function createMarker(place) {
      
          new google.maps.Marker({
              position: place.geometry.location,
              map: map
          });
      }
})

});
