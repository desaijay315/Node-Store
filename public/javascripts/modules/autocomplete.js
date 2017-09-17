function autocomplete(input, latInput,lngInput){
     
     if(!input) return; //skip this from running f there is not  inpt on thid page
     const dropdown = new google.maps.places.Autocomplete(input);

     dropdown.addListener('place_changed', () => {
        const  place = dropdown.getPlace();
        latInput.value  = place.geometry.location.lat();
        lngInput.value  = place.geometry.location.lng();
     });

     //if someone hits the enter dont submit the form
     input.on('keydown', (e)=> {
     	if(e.keyCode === 13){
               e.preventDefault();
     	}
     } )
}

export default  autocomplete;