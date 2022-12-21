let map;

const getCurrentPosition = () => {
  return new Promise((res, rej)=>{
    navigator.geolocation.getCurrentPosition(
      position => res(position.coords),
      error => rej(error),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  })
};

const circleXY = (r, angle) => {
  // Convert angle to radians
  let theta = (angle-90) * Math.PI/180;

  return {x: Math.round(r * Math.cos(theta)),
          y: Math.round(-r * Math.sin(theta))}
}

const generateRandomMarkers = (lat, lng, distanceInMeters = 100)=>{
  for (let theta=0; theta<=360; theta += 10) {
    // get coordinates for each theta
    let {x, y} = circleXY(distanceInMeters, theta);

    const position = getLatLonGivenDistanceAndBearing(lat, lng, x, y );
    const distance = getDistanceFromLatLonInKm(lat, lng, position.lat, position.lng);

    const iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    const marker = new google.maps.Marker({
      position,
      title: `Latitude: ${position.lat} | Longitude: ${position.lng}`,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: iconBase + "library_maps.png"
    });

    const contentString = `
      <div>
        <p>Latitude: ${position.lat.toFixed(6)}</p>
        <p>Longitude: ${position.lng.toFixed(6)}</p>
        <p>Distance: ${distance.toFixed(6)} Km</p>
      </div>`;

    const infowindow = new google.maps.InfoWindow({
      content: contentString,
      ariaLabel: "position",
    });

    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map,
      });
    });
  }
}


async function initMap()  {
  const {latitude: lat, longitude: lng} = await getCurrentPosition();
  console.log(lat, lng);
  
  const mapEl = document.getElementById('map');
  
  map = new google.maps.Map(mapEl, {
      zoom: 18,
      center: {lat, lng}
    }
  );

  const userMarker = new google.maps.Marker({
    position: {lat, lng},
    map: map,
  });

  generateRandomMarkers(lat, lng, 100);
}


// Initialize and add the map
function initMap3({lat, lng, mapContainer}) {
  const mapEl = document.getElementById(mapContainer);
  
  const map = new google.maps.Map(mapEl,
    {
      zoom: 18,
      center: {lat, lng}
    }
    );
    
    return map;
  }
  
  
  function initMap4() {
    const position = 
      navigator.geolocation.getCurrentPosition(
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

        const iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
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


function getLatLonGivenDistanceAndBearing(lat, lon, de, dn){
// console.log(lat, lon);
 //Earth’s radius, sphere
 const R=6378137

 //offsets in meters
//  const dn = 10
//  const de = 9

 //Coordinate offsets in radians
 const dLat = dn/R;
 const dLon = de/(R*Math.cos(Math.PI*lat/180));

 //OffsetPosition, decimal degrees
 const latO = lat + dLat * 180/Math.PI;
 const lonO = lon + dLon * 180/Math.PI;
//  console.log(latO,lonO);
 return {lat: latO, lng: lonO };
}

// window.initMap = initMap;
initMap();
// x++;