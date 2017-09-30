const axios = require('axios');
import  {$} from './bling';

const mapOptions = {
	center : {lat:19.1, lng:  72.8 },
	zoom: 10
}

function loadPlaces (map, lat= 19.1, lng=  72.8) {
	// body...
     axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`)
             .then(res =>{
             	const places = res.data;
             	console.log(places);
             	if(!places.length){
                           alert('no places found');
             	 return false;
             	}

             	//creat bonds
             	const bounds = new google.maps.LatLngBounds();
                        const infoWindow = new google.maps.InfoWindow();

                       const markers = places.map(place =>{
                     	const [placeLng, placeLat] =  place.location.coordinates;
                     	const position = {lat: placeLat, lng: placeLng};
                     	bounds.extend(position);
                     	const marker = new google.maps.Marker({map, position})
                     	;
                     	marker.place = place;
                     	return marker;
                     });
                     //show detailson click
                     markers.forEach(marker => marker.addListener('click', function(){
                     	  console.log(this);
                     	  const html = `
 		    <div class="popup">
 		       <a href="/store/${this.place.slug}">
 		        <img src="/uploads/${this.place.photo || 'store.png' }" alt="${this.place.name}">
 		        <p>${this.place.name} - ${this.place.location.address} </p>
 		    </div>
                     	  `;
                     	  infoWindow.setContent(html);
                     	  infoWindow.open(map, this);
                     }));

                      //then zoom the marker to fir that paerfectly
                      map.setCenter(bounds.getCenter());
                      map.fitBounds(bounds);
             })
}


function makeMap(mapDiv){
  console.log(mapDiv);
  if(!mapDiv){
    return;
  } 

 const map = new google.maps.Map(mapDiv, mapOptions);
 loadPlaces(map);

 const input = $('[name="geolocate"]');
 const autocomplete = new google.maps.places.Autocomplete(input);
console.log(autocomplete);
 
 
      autocomplete.addListener('place_changed', () => {
        const  place = autocomplete.getPlace();
        console.log(place);
       const  latInput  = place.geometry.location.lat();
        console.log("lat "+ latInput);
        const lngInput  = place.geometry.location.lng();
        loadPlaces(map,latInput ,lngInput );

     });


}

export default makeMap;