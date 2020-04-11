// Add console.log to check to see if our code is working.
console.log("working");

// Create the map object with a center and zoom level.
//  zoom level [0 :: 18].
let map, mapOption = 1;
if (mapOption == 1) {
    //  LA
    map = L.map('mapid').setView([29.7604, -95.3698], 4);
} else {
    // if multiple layers or a background is needed.
    map = L.map("mapid", {
        center: [40.7, -94.5],
        zoom: 4
    });
}

//  Get data from cities.js
let cityData = cities;

// Loop through the cities array and create one marker for each city.
cityData.forEach(function (city) {
    console.log(city);
    L.circleMarker(city.location, {
        radius: (city.population - 200000) / 100000,
        color: "orange",
        weight: 4
    })
        .bindPopup("<h2>" + city.city + ", " + city.state + "</h2> <hr> <h3>Population " + city.population.toLocaleString() + "</h3>")
        .addTo(map);
});

//  Add a marker to the map for Los Angeles, California.
//  100 meters
//let marker = L.circle([34.0522, -118.2437], { radius: 100 }).addTo(map);
//  300 pixels
/*
let marker = L.circleMarker([34.0522, -118.2437], {
    radius: 300,
    color: "black",
    fillColor: '#ffffa1'
}).addTo(map);
*/
// We create the tile layer that will be the background of our map.
let streets, tileLayerOption = 2;
if (tileLayerOption == 1) {
    streets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: API_KEY
    });
} else {
    streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        accessToken: API_KEY
    });

}
// Then we add our 'graymap' tile layer to the map.
streets.addTo(map);

