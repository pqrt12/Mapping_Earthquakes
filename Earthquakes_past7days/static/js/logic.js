// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// We create the dark view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// We create the dark view tile layer that will be an option for our map.
let lights = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

//  Create a base layer that holds both maps.
//  no difference seen w/, w/o quote marks.
let baseMaps = {
    "Streets": streets,
    Satellite: satelliteStreets,
    Lights: lights
};

// Create the map object with a center and zoom level.
let map = L.map('mapid', {
    center: [39.5, -98.5],
    zoom: 3,
    layers: [streets],
    'worldCopyJump': true
});

// Create the earthquake layer for our map.
let earthquakes = new L.layerGroup();
let tectonicPlates = new L.layerGroup();

// We define an object that contains the overlays.
// This overlay will be visible all the time.
let overlays = {
    "Tectonic Plates": tectonicPlates,
    Earthquakes: earthquakes
};

// Then we add a control to the map that will allow the user to change
// which layers are visible.
L.control.layers(baseMaps, overlays).addTo(map);


// Retrieve the earthquake GeoJSON data.
let usgsJson = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(usgsJson).then(function (data) {
    // This function returns the style data for each of the earthquakes we plot on
    // the map. We pass the magnitude of the earthquake into a function
    // to calculate the radius.
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // This function determines the radius of the earthquake marker based on its magnitude.
    // Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
    }

    // This function determines the color of the circle based on the magnitude of the earthquake.
    function getColor(magnitude) {
        if (magnitude > 5) {
            return "#ea2c2c";
        }
        if (magnitude > 4) {
            return "#ea822c";
        }
        if (magnitude > 3) {
            return "#ee9c00";
        }
        if (magnitude > 2) {
            return "#eecc00";
        }
        if (magnitude > 1) {
            return "#d4ee00";
        }
        return "#98ee00";
    }


    // Creating a GeoJSON layer with the retrieved data.
    L.geoJson(data, {
        // We turn each feature into a circleMarker on the map.
        pointToLayer: function (feature, latlng) {
            //            console.log(data);
            return L.circleMarker(latlng);
        },
        // We set the style for each circleMarker using our styleInfo function.
        style: styleInfo,

        // We create a popup for each circleMarker to display the magnitude and
        //  location of the earthquake after the marker has been created and styled.
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(earthquakes);

    //  Then we add the earthquake layer to our map.
    earthquakes.addTo(map);

    // Create a legend control object.
    let legend = L.control({
        position: "bottomright"
    });

    // Then add all the details for the legend.
    legend.onAdd = function () {

        let div = L.DomUtil.create("div", "info legend");

        const magnitudes = [0, 1, 2, 3, 4, 5];
        const colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
        ];

        //        div.innerHTML += "<style> i { font-size: large; font-weight: bold; /*font-style: arial;*/ } </style>";
        // Looping through our intervals to generate a label with a colored square for each interval.
        for (var i = 0; i < magnitudes.length; i++) {
            console.log(colors[i]);
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                magnitudes[i] +
                (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
            //  "-" and "&ndash;" are similar, but different.
        }
        return div;
    };

    legend.addTo(map);
});


//  tectonic plate boundaries json.
//  NOTE: "raw" must be selected in github.
let tpbJson = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
d3.json(tpbJson).then(function (data) {
    console.log(data);

    // Creating a GeoJSON layer with the retrieved data.
    L.geoJson(data, {
        style: {
            opacity: 1,
            color: "darkorange",
            weight: 2
        },

        //  a popup for plate boundary Name.
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<b>Plate Boundary: " + feature.properties.Name + "<b>");
        }
    }).addTo(tectonicPlates);

    //  Then we add the earthquake layer to our map.
    tectonicPlates.addTo(map);
});
