// ************************************************************
// *  
// *
// *    
// *  
// *
// ************************************************************

// Store API query variable
var apiURL = "/api/v1.0/alldata"

// Get a reference to the table body
var tbody = d3.select("tbody");

// Select the button
var button = d3.select("#filter-btn");

// Select the form
var form = d3.select("#form");

// Create event handlers 
button.on("click", runEnter);

// Complete the event handler function for the form
function runEnter() {

    tbody.html("");

    var curLat;
    var curLng;

    // **** \/ BEGIN GET CURRENT POSITION \/ ****
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    
    function success(pos) {
        var crd = pos.coords;
        curLat = crd.latitude;
        curLng = crd.longitude;
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    
    navigator.geolocation.getCurrentPosition(success, error, options);
    // ****  /\ END GET CURRENT POSITION /\ ****


    // Grab the data with d3
    d3.json(apiURL).then(function(response) {

        var tableDict = {}

    // Loop through data
        for (var i = 0; i < response.length; i++) {
    
        // Set the data location property to a variable
        var restaurant = response[i];
        
        // Check for restaurant property
            if (restaurant) {

                // Latitude +/- .5 = ~69 miles, Longitude +/- .5 = ~55 miles
                if ((restaurant.Lat > (curLat - .5) && restaurant.Lat < (curLat + .5)) && (restaurant.Lng > (curLng - .5) && restaurant.Lng < (curLng + .5))) {
                    
                    // Build dictionary to insert into the HTML table
                    tableDict ["rank"] = restaurant.Rank;
                    tableDict ["restaurant"] = restaurant.Restaurant;
                    tableDict ["city"] = restaurant.City;
                    tableDict ["state"] = restaurant.State;
                    tableDict ["avg_check"] = "$" + restaurant.Average_Check;

                    // Insert rows into table when found
                    var row = tbody.append("tr");
                    Object.entries(tableDict).forEach(([key, value]) => {
                    var cell = row.append("td");
                    cell.text(value);
                    });
                };
            };
        };   

        // Added check for if no restaurants found, display message for user
        if (Object.keys(tableDict).length === 0){
            var row = tbody.append("tr");
            var cell = row.append("td");
            cell.text("NO RESTAURANTS WITHIN 70 MILES");    
        };
    
  });
};

