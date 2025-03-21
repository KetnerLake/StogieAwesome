const about = document.querySelector( 'sa-about' );
about.addEventListener( 'sa-close', () => {
  about.hide().then( () => about.reset() );
} );

const alert = document.querySelector( 'sa-alert' );
alert.addEventListener( 'sa-dismiss', () => {
  dialog.close();
  favorites.focus();
} );

const dialog = document.querySelector( 'dialog' ); 

const favorites = document.querySelector( 'sa-favorites' );
favorites.addEventListener( 'sa-minimum', ( evt ) => {
  alert.message = 'You must have at least three favorites.';
  dialog.showModal();
} );
favorites.addEventListener( 'sa-recommendations', () => {
  favorites.animate( [
    {left: '0'},
    {left: '-50vw'}        
  ], {
    duration: 350,
    easing: 'cubic-bezier( 0.42, 0, 0.58, 1 )',        
    fill: 'forwards'
  } );    
  recommendations.animate( [
    {left: '100vw'},
    {left: '0'}        
  ], {
    duration: 350,
    easing: 'cubic-bezier( 0.42, 0, 0.58, 1 )',        
    fill: 'forwards'
  } ); 
} );

const landing = document.querySelector( 'sa-landing' );
landing.addEventListener( 'sa-recommend', ( evt ) => {
  recommendations.animate( [
    {left: '100vw'},
    {left: '0'}        
  ], {
    duration: 350,
    easing: 'cubic-bezier( 0.42, 0, 0.58, 1 )',        
    fill: 'forwards'
  } ).finished.then( () => landing.hidden = true );

  favorites.items = evt.detail.favorites;

  evt.detail.favorites = evt.detail.favorites.map( ( value ) => {
    const now = Date.now();
    return {
      id: self.crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      name: value
    }
  } );
  db.favorites.bulkPut( evt.detail.favorites )
  .then( () => makeRecommendation( evt.detail.favorites ) )
  .then( ( data ) => {
    data = data.recommendations.map( ( value ) => {
      const now = Date.now();
      value.id = self.crypto.randomUUID();
      value.createdAt = now;
      value.updatedAt = now;
      return value
    } );
    data.sort( ( a, b ) => {
      if( a.name > b.name ) return 1;
      if( a.name < b.name ) return -1;
      return 0;
    } );
    recommendations.items = data;
    return db.recommendations.bulkPut( data );
  } );
} );

const recommendations = document.querySelector( 'sa-recommendations' );
recommendations.addEventListener( 'sa-about', () => {
  about.show();
} );
recommendations.addEventListener( 'sa-action', () => {
  console.log( 'ACTION' );
} );
recommendations.addEventListener( 'sa-favorite', ( evt ) => {
  
} );
recommendations.addEventListener( 'sa-favorites', () => {
  recommendations.animate( [
    {left: 0},
    {left: '100vw'}        
  ], {
    duration: 350,
    easing: 'cubic-bezier( 0.42, 0, 0.58, 1 )',        
    fill: 'forwards'
  } ); 
  favorites.animate( [
    {left: '-50vw'},
    {left: '0'}        
  ], {
    duration: 350,
    easing: 'cubic-bezier( 0.42, 0, 0.58, 1 )',        
    fill: 'forwards'
  } );   
} );
recommendations.addEventListener( 'sa-refresh', () => {
  console.log( 'REFRESH' );
} );

const db = new Dexie( 'StogieAwesome' );
db.version( 1 ).stores( {
  favorites: 'id, name',
  recommendations: 'id, name'
} );
db.recommendations.toArray()
.then( ( data ) => { 
  if( data.length > 0 ) {
    data.sort( ( a, b ) => {
      if( a.name > b.name ) return 1;
      if( a.name < b.name ) return -1;
      return 0;
    } );

    landing.hidden = true;
    favorites.style.left = 'calc( 0 - 100vw )';
    recommendations.items = data;    
    recommendations.style.left = '0';
  }
  return db.favorites.toArray();
} )
.then( ( data ) => {
  data = data.map( ( value ) => value.name );
  data.sort( ( a, b ) => {
    if( a > b ) return 1;
    if( a < b ) return -1;
    return 0;
  } );
  favorites.items = data;
} );

fetch( '/data/cigars.json' )
.then( ( response ) => response.json() )
.then( ( data ) => {
  data.sort( ( a, b ) => {
    if( a > b ) return 1;
    if( a < b ) return -1;
    return 0;
  } );
  favorites.catalog = data;
  landing.catalog = data;
} );

function makeRecommendation( cigars ) {
  return fetch( 'https://1zs3y8uevh.execute-api.us-west-2.amazonaws.com/Production/recommendations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( cigars )
  } )
  .then( ( response ) => response.json() );    
}
