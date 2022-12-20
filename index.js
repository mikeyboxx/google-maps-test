// Initialize and add the map
function initMap3({lat, lng, mapContainer}) {
  const mapEl = document.getElementById(mapContainer);
  
  const map = new google.maps.Map(mapEl,
    {
      zoom: 14,
      center: {lat, lng}
    }
    );
    
    return map;
  }
  
  
  function initMap() {
    const position = navigator.geolocation.getCurrentPosition(
      // callback with coordinates
      (position)=>{
        const currentLocation = { 
          lat: position.coords.latitude, 
          lng: position.coords.longitude 
        };
        const map = initMap3({...currentLocation, mapContainer: 'map'});

        const userMarker = new google.maps.Marker({
          position: currentLocation,
          map: map,
        });

        const noteMarkers = [];

        console.log(currentLocation);
        // generate random notes within a radius
        for (let i = 0; i < 10; i ++){
          let n = (Math.floor(Math.random() * 100) + 1)/10000;
          let posOrNeg = Math.round(Math.random());
          const lat = posOrNeg ? currentLocation.lat + n : currentLocation.lat - n
          
          n = (Math.floor(Math.random() * 100) + 1)/10000;
          posOrNeg = Math.round(Math.random());
          const lng = posOrNeg ? currentLocation.lng + n : currentLocation.lng - n

          const distance = getDistanceFromLatLonInKm(currentLocation.lat, currentLocation.lng, lat, lng )/1.609;

          console.log(lat, lng, distance);
          const pos = {
            lat,
            lng
          }

          const iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

          const marker = new google.maps.Marker({
            position: {
              ...pos
            },
            title: `Latitude: ${lat} | Longitude: ${lng}`,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: iconBase + "library_maps.png"
          });


          const contentString = `
          <div>
            <p>Latitude: ${lat.toFixed(3)}</p>
            <p>Longitude: ${lng.toFixed(3)}</p>
            <p>Distance: ${distance.toFixed(2)} miles</p>
          </div>`;

          const infowindow = new google.maps.InfoWindow({
            content: contentString,
            ariaLabel: "pos",
          });

          marker.addListener("click", () => {
            infowindow.open({
              anchor: marker,
              map,
            });
          });

          noteMarkers.push(marker);
        }
  
        // const timer = setInterval(()=>{
        //   console.log('tick');
        //   console.log(currentLocation);
        //   currentLocation.lat += .01;
        //   currentLocation.lng += .01;

        //   let latlng = new google.maps.LatLng(currentLocation.lat, currentLocation.lng);
        //   marker.setTitle("Latitude:" + currentLocation.lat +" | Longitude:" + currentLocation.lng);
        //   marker.setPosition(latlng);

        //   // marker.setPosition(currentLocation);
        //   // marker.map = map;
        // }, 3000)
      },
      (error) => console.warn(`ERROR(${error.code}): ${error.message}`),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }

      
    );
  }


function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

// window.initMap = initMap;
initMap();
// x++;