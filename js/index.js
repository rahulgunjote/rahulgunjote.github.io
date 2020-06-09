var map;
var infowindow
var marker
var circle
var shape
var locationMarkers = []
const elements = {
    location_lat: document.getElementById("location_lat"),
    location_lng: document.getElementById("location_lng"),
    location1_lat: document.getElementById("location1_lat"),
    location1_lng: document.getElementById("location1_lng"),
    location2_lat: document.getElementById("location2_lat"),
    location2_lng: document.getElementById("location2_lng"),
    location3_lat: document.getElementById("location3_lat"),
    location3_lng: document.getElementById("location3_lng"),
    location4_lat: document.getElementById("location4_lat"),
    location4_lng: document.getElementById("location4_lng"),
    description: document.getElementById('description'),
    btnReset: document.getElementById('btn_reset'),
    btnTest: document.getElementById('btn_test')
}


var form = document.getElementById("search");
DMSFormattedString = (decimalString) => {
    let degrees, minutes, seconds

    if (decimalString.split('.')[0].length > 6) {
        //1302648.5 will be formatted to 130° 26' 48.5"
        degrees = decimalString.substring(0, 3)
        minutes = decimalString.substring(3, 5)
        seconds = decimalString.slice(5)
    } else {
        //333517.8 will be formatted to 33° 35' 17.8"
        degrees = decimalString.substring(0, 2)
        minutes = decimalString.substring(2, 4)
        seconds = decimalString.slice(4)
    }
    return `${degrees}° ${minutes}' ${seconds}"`
}
function locationFromInput(latValue, lngValue) {
    let geoPoint
    if (latValue && lngValue) {
        //If input is in DMS format like 333517.8, 1302648.5, then convert it into decimal coordinate format using GeoPoint 
        if (latValue.split('.')[0].length > 3 && lngValue.split('.')[0].length > 3) {
            geoPoint = new GeoPoint(
                DMSFormattedString(lngValue),
                DMSFormattedString(latValue))
        } else {
            const lat = parseFloat(latValue)
            const lng = parseFloat(lngValue)
            geoPoint = new GeoPoint(lng, lat)
        }
        if (geoPoint) {
            return { lat: geoPoint.getLatDec(), lng: geoPoint.getLonDec() }
        }
    }
    return geoPoint

}
function handleForm(event) {
    event.preventDefault();
    // console.log('Handling form submission')

    const latValue = elements.location_lat.value.trim()
    const lngValue = elements.location_lng.value.trim()

    let portLocation = locationFromInput(latValue, lngValue)
    if (!portLocation) {
        alert('Invalid Port Location')
    }

    let markLocations = []
    const lat1 = elements.location1_lat.value.trim()
    const lng1 = elements.location1_lng.value.trim()
    let location1 = locationFromInput(lat1, lng1)
    if (location1) markLocations.push(location1)
    console.log(`Location 1: ${location1}`)

    const lat2 = elements.location2_lat.value.trim()
    const lng2 = elements.location2_lng.value.trim()
    let location2 = locationFromInput(lat2, lng2)
    if (location2) markLocations.push(location2)

    const lat3 = elements.location3_lat.value.trim()
    const lng3 = elements.location3_lng.value.trim()
    let location3 = locationFromInput(lat3, lng3)
    if (location3) markLocations.push(location3)

    const lat4 = elements.location4_lat.value.trim()
    const lng4 = elements.location4_lng.value.trim()
    let location4 = locationFromInput(lat4, lng4)
    if (location4) markLocations.push(location4)

    const description = elements.description.value
    placeMarker(portLocation, description)
    drawShape(portLocation, markLocations)
}

function initMap() {
    var mapOptions = {
        zoom: 10,
        center: { lat: -37.8170652, lng: 144.9419122 },
        mapTypeId: 'satellite',
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        scaleControl: true,
    };
    map = new google.maps.Map(document.getElementById('map'),
        mapOptions);

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // elements.location_lat.value = `${position.coords.latitude}`
            // elements.location_lng.value = `${position.coords.longitude}`
            map.setCenter(pos);
            // marker = new google.maps.Marker({
            //     // The below line is equivalent to writing:
            //     // position: new google.maps.LatLng(-34.397, 150.644)
            //     position: pos,
            //     map: map
            // });

        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}
function placeMarker(location, info) {
    if (marker) marker.setMap(null);
    marker = new google.maps.Marker({
        // The below line is equivalent to writing:
        // position: new google.maps.LatLng(-34.397, 150.644)
        position: location,
        animation: google.maps.Animation.DROP,
        map: map
    });
    infowindow = new google.maps.InfoWindow({
        content: `<p>${info}</p>`
    });
    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });
    marker.addListener('mouseover', function () {
        infowindow.open(map, this);
    });
    // assuming you also want to hide the infowindow when user mouses-out
    marker.addListener('mouseout', function () {
        infowindow.close();
    });
}
function drawShape(portLocation, locations) {
    if (shape) {
        shape.setMap(null)
    }

    var bounds = new google.maps.LatLngBounds();
    bounds.extend(new google.maps.LatLng(portLocation.lat, portLocation.lng))
    locations.forEach(location => {
        bounds.extend(new google.maps.LatLng(location.lat, location.lng))
    })

    shape = new google.maps.Polygon({
        paths: locations,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
    });
    shape.setMap(map);
    map.fitBounds(bounds);
    //map.setCenter(portLocation);
}
/*
function drawCircle(center, locations) { 

    locationMarkers.forEach(lMarker => lMarker.setMap(null))
    locationMarkers = []
    
    var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    locations.forEach( l => {
      locationMarkers.push(new google.maps.Marker({
                    position: l,
                    map: map,
                    icon: image
       }));
    })
    const distances = locations.map(location => {
        const distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng({ lat: location.lat, lng: location.lng }),
            new google.maps.LatLng({ lat: center.lat, lng: center.lng })
        );
        if(distanceInMeters) return distanceInMeters
        return 0
    })
    let radius = 100
    if(distances.length > 0) {
        radius = Math.max(...distances) + Math.max(...distances)/10
        if(isNaN(radius) || radius <= 0) {
            radius = 100
        }
    }
    if (circle) {
       circle.setMap(null)
    }
    circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: center,
        //radius: 10000
        radius: radius
    });
    var bounds = circle.getBounds();
    map.fitBounds(bounds);
    map.panToBounds(bounds);
    map.setCenter(center);

}
*/
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}
elements.btnReset.addEventListener('click', () => {

    elements.location_lat.value = ''
    elements.location_lng.value = ''
    elements.location1_lat.value = ''
    elements.location1_lng.value = ''
    elements.location2_lat.value = ''
    elements.location2_lng.value = ''
    elements.location3_lat.value = ''
    elements.location3_lng.value = ''
    elements.location4_lat.value = ''
    elements.location4_lng.value = ''
    elements.description.value = ''
})
elements.btnTest.addEventListener('click', () => {

    // elements.location_lat.value = '-37.673277'
    // elements.location_lng.value = '144.831268'

    //  elements.location1_lat.value = '-37.6732783'
    //  elements.location1_lng.value = '144.8137586'

    //  elements.location2_lat.value = '-37.6779531'
    //  elements.location2_lng.value = '144.823938'

    //  elements.location3_lat.value = '-37.6732766'
    //  elements.location3_lng.value = '144.846589'

    //  elements.location4_lat.value = '-37.6729114'
    //  elements.location4_lng.value = '144.8336607'

    elements.location_lat.value = '33.5903'
    elements.location_lng.value = '130.4467'

    elements.location1_lat.value = '333517.8'
    elements.location1_lng.value = '1302648.5'

    elements.location2_lat.value = '333505.2'
    elements.location2_lng.value = '1302657.1'

    elements.location3_lat.value = '333505.0'
    elements.location3_lng.value = '1302656.6'

    elements.location4_lat.value = '333517.5'
    elements.location4_lng.value = '1302648.0'

    elements.description.value = 'VEHICLE EXIST BLW TRANSITIONAL SFC-1.PSN     : BOUNDED BY FLW POINT-333517.8N1302648.5E 333505.2N1302657.1E-333505.0N1302656.6E 333517.5N1302648.0E-(988.5M TO 1445.0M BEYOND RWY 16 THR AND-184.0M TO 198.1M RIGHT RCL)-2.NUMBER  : MAX 33-3.RMK     : (1) WX MNM-INSTRUMENT APCH PROC-DEP PROC NO CHANGE-(2) OBST LGT INSTL-F)SFC G)38FT AMSL)-'
})
form.addEventListener('submit', handleForm);