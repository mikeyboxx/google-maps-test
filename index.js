// Initialize and add the map
function initMap() {
  console.log(navigator);
  const geoLocation = navigator.geolocation;
  const position = geoLocation.getCurrentPosition(
    (position)=>{
      console.log(position);
      const currentLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
  // The map, centered at Uluru
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 18,
        center: currentLocation,
      });
  // The marker, positioned at Uluru
      const marker = new google.maps.Marker({
        position: currentLocation,
        map: map,
      });
    },
    (error)=>{
      console.warn(`ERROR(${error.code}): ${error.message}`);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  );
  // cobsole.log(position);

  // The location of Uluru
  // const uluru = { lat: -25.344, lng: 131.031 };
  
}

window.initMap = initMap;