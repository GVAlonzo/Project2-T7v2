// Creating map object
var myMap = L.map("map", {
  center: [40.7, -93.95],
  zoom: 4
});

// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Store API query variable
var apiURL = "/api/v1.0/alldata"

// Grab the data with d3
d3.json(apiURL).then(function(response) {

  // Create a new marker cluster group
  var markers = L.markerClusterGroup();

  // Loop through data
  for (var i = 0; i < response.length; i++) {

    // Set the data location property to a variable
    var restaurant = response[i];
    
    // Check for location property
    if (restaurant) {

      // Add a new marker to the cluster group and bind a pop-up
      markers.addLayer(L.marker([restaurant.Lat, restaurant.Lng])
        .bindPopup("<h2>" + restaurant.Restaurant.toUpperCase() + "</h2>"
                        + "<h3> City: " + restaurant.City + "</h3>"
                        + "<h3> <hr> Rank: " + restaurant.Rank + "</h3>"
                        + "<h3> Average Check: $" + restaurant.Average_Check + "</h3>"
                        + "<h3> Meals Served: " + restaurant.Meals_Served + "</h3>"
                        + "<h3> Sales: $" + restaurant.Sales + "<br></h3>"));
    }
  }

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);

});
