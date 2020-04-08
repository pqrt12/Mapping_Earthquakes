// Add console.log to check to see if our code is working.
console.log("working");

// Create the map object with a center and zoom level.
let map = L.map('mapid').setView([30, 30], 2);

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Then we add our 'graymap' tile layer to the map.
streets.addTo(map);

//  Accessing the airport GeoJSON URL
// Note: after tile layer to ensure map gets loaded.
let airportData = "https://raw.githubusercontent.com/pqrt12/Mapping_Earthquakes/Mapping_GeoJSON_Points/majorAirports.json";

// Grabbing our GeoJSON data.
d3.json(airportData).then(function (data) {
    console.log(data);
    // Creating a GeoJSON layer with the retrieved data.
    L.geoJson(data).addTo(map);

    L.geoJson(data, {
        onEachFeature: function (feature, layer) {
            //        console.log(feature);
            //        console.log(layer);
            L.marker(feature.geometry.coordinates);
            layer.bindPopup("<h2>Airport Code: " + feature.properties.faa + "</h2> <hr> <h4>Airport name: " + feature.properties.name + "</h4>");
        }
    }).addTo(map);

});
