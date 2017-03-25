var map = L.map('map').setView([48.517,18.255], 5);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var transactionLayer = L.layerGroup();
var greenIcon = L.icon({
    iconUrl: 'http://icons.iconarchive.com/icons/hopstarter/scrap/256/Aqua-Ball-Green-icon.png',
    iconSize: [20, 20]
});
var redIcon = L.icon({
    iconUrl: 'http://icons.iconarchive.com/icons/hopstarter/scrap/256/Aqua-Ball-Red-icon.png',
    iconSize: [20, 20]
});

var realtime = L.realtime({
    url: 'http://172.104.35.219/api/dashboard/transactions',
    crossOrigin: true,
    type: 'json' 
    }, {
    interval: 1 * 1000,
    getFeatureId: function(featureData){
    	return featureData.id;
    },
    pointToLayer: function (feature, latlng) {
        if (feature.properties.Status == "red") {
            marker = L.marker(latlng, {icon: redIcon});
        }
        if (feature.properties.Status == "green") {
            marker = L.marker(latlng, {icon: greenIcon});
        }

        marker.bindPopup('Name: ' + feature.properties.Name +
                       '<br/> Status: ' + feature.properties.Status);
        marker.addTo(transactionLayer);
        return marker;
    }
    
}).addTo(map);

realtime.on('update', function() {
    map.fitBounds(realtime.getBounds(), {maxZoom: 5});
});
