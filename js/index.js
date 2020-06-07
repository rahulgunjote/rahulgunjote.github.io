var map;
var infowindow
var marker
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
    description: document.getElementById('description')
}


var form = document.getElementById("search");
function handleForm(event) 
{ 
    event.preventDefault(); 
    // console.log('Handling form submission')
    // elements.location4_lat.value = '-37.5813037'
    // elements.location4_lng.value = '144.8874391'

    // elements.location1_lat.value = '-37.6965763'
    // elements.location1_lng.value = '144.7707333'

    // elements.location2_lat.value = '-37.6966858'
    // elements.location2_lng.value = '144.5080816'

    // elements.location3_lat.value = '-37.7027903'
    // elements.location3_lng.value = '145.0469404'


    const lat = parseFloat(elements.location_lat.value.trim())
    const lng = parseFloat(elements.location_lng.value.trim())
    let portLocation
    if (lat && lng) {
       portLocation = {lat: lat, lng: lng}
    }

    let markLocations = []
    const lat1 = parseFloat(elements.location1_lat.value.trim())
    const lng1 = parseFloat(elements.location1_lng.value.trim())
    let location1
    if (lat1 && lng1) {
       location1 = {lat: lat1, lng: lng1}
    }
    if(location1) markLocations.push(location1)
    console.log(`Location 1: ${location1}`)

    const lat2 = parseFloat(elements.location2_lat.value.trim())
    const lng2 = parseFloat(elements.location2_lng.value.trim())
    let location2
    if (lat2 && lng2) {
       location2 = {lat: lat2, lng: lng2}
    }
    if(location2) markLocations.push(location2)

    const lat3 = parseFloat(elements.location3_lat.value.trim())
    const lng3 = parseFloat(elements.location3_lng.value.trim())
    let location3
    if (lat3 && lng3) {
        location3 = {lat: lat3, lng: lng3}
    }
    if(location3) markLocations.push(location3)

    const lat4 = parseFloat(elements.location4_lat.value.trim())
    const lng4 = parseFloat(elements.location4_lng.value.trim())
    let location4
    if (lat4 && lng4) {
       location4 = {lat: lat4, lng: lng4}
    }
    if(location4) markLocations.push(location4)

    const description = elements.description.value
    placeMarker(portLocation, description)
    drawShape(portLocation, markLocations)


} 


function initMap() {
    var mapOptions = {
        zoom: 10,
        center: { lat: -37.8170652, lng: 144.9419122},
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
            
            elements.location_lat.value = `${position.coords.latitude}`
            elements.location_lng.value = `${position.coords.longitude}`

            //elements.location_lat.value = `-37.6732766`
            //elements.location_lng.value = `144.846589`
            //document.getElementById('description').value = 'This is an amazing place to visit'
            map.setCenter(pos);
            marker = new google.maps.Marker({
                // The below line is equivalent to writing:
                // position: new google.maps.LatLng(-34.397, 150.644)
                position: pos,
                map: map
            });
            //drawShape(pos)

        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}
function placeMarker(location, info) {
    marker.setMap(null);
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
    marker.addListener('mouseover', function() {
        infowindow.open(map, this);
    });
    // assuming you also want to hide the infowindow when user mouses-out
    marker.addListener('mouseout', function() {
        infowindow.close();
    });
}
function drawShape(center, locations) {

    console.log("Calculating distance... ")

    // locations = [{ lat: -37.5813037, lng: 144.8874391 },
    // { lat: -37.6965763, lng: 144.7707333 },
    // { lat: -37.6966858, lng: 144.5080816 },
    // { lat: -37.7027903, lng: 145.0469404 }]
    
    var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

    locations.forEach( l => {
               new google.maps.Marker({
                    position: l,
                    map: map,
                    icon: image
                });
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
     
    var circle = new google.maps.Circle({
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

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

form.addEventListener('submit', handleForm);