
var es = require("emoji-search");

var markers = [];

function hover(id) {
    for ( var i = 0; i< markers.length; i++) {
        if (id === markers[i].id) {
           markers[i].setIcon(icon2);
           break;
        }
   }
}

//Function called when out the div
function out(id) {  
    for ( var i = 0; i< markers.length; i++) {
        if (id === markers[i].id) {
           markers[i].setIcon(icon1);
           break;
        }
   }
}



window.initMap = function() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 37.8716, lng: -122.2727},
      zoom: 13,
      mapTypeId: 'roadmap'
    });
    infoWindow = new google.maps.InfoWindow;

    var input = document.getElementById('search-input');
    var searchBox = new google.maps.places.SearchBox(input);


    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent('Location');
        infoWindow.open(map);
        map.setCenter(pos);
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }



    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    markers = [];

   
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    var id = 0;
    searchBox.addListener('places_changed', function() {
        var placesList = document.getElementById('places');
        var input = document.getElementById('search-input');

        console.log(es(input.value.split(' ').join('_'))[0]);

        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }

        placesList.innerHTML = "";
        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        var timeItr = 0;
        var timeout = 0;

       
        places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }


                
            window.setTimeout(function() {
                markers.push(new google.maps.Marker({
                position: place.geometry.location,
                label: {
                  text: es(input.value.split(' ').join('_'))[0],
                  fontSize: "18px"
                },
                map: map,
              }));
            }, timeout); 

            placesList.innerHTML += "<div onmouseover='hover(" + id + ")'" + "onmouseout='out(" + id + ")'" + "<li>" + place.name + "</li>" + "</div>";       
            id++;     


            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
      map.fitBounds(bounds);
    });
}




// allow form submission without page reload

$('form').submit(function(e){
    e.preventDefault();
});









