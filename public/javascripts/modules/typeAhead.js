const axios = require('axios');

function searchResultsHTML(stores){
    return stores.map(store=> {
    	return `
    	<a href="/store/${store.slug}" class="search__result">
              <strong>${store.name}</strong>
    	 </a>
    	 `;
    }).join('');
}

function typeAhead (search) {
    if(!search){
       return;
    }

    const searchInput = search.querySelector('input[name="search"]');

    const searchResult  = search.querySelector('.search__results');

    searchInput.on('input', function(){
    	// if there s no value , quit
    	if(!this.value){
    		searchResult.style.display ='none';
    		return; //stop
    	}
           
           searchResult.style.display ='block';
           searchResult.innerHTML ='';

           axios
                  .get(`/api/search?q=${this.value}`)
                  .then(res =>{
                  	if(res.data.length){     
                  	console.log(res.data);                         
                              searchResult.innerHTML = searchResultsHTML(res.data);
                  	}
                  })
                  .catch(err=>{
                      console.error(err);
                  });

    });
}

export default typeAhead;