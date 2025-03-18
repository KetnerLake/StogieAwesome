const about = document.querySelector( 'sa-about' );
about.addEventListener( 'sa-close', () => {
  about.hidden = true;
  about.reset();
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
  favorites.hidden = true;
  recommendations.hidden = false;
} );

const landing = document.querySelector( 'sa-landing' );
landing.addEventListener( 'sa-recommend', ( evt ) => {
  landing.hidden = true;
  recommendations.hidden = false;
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
    recommendations.items = data;
    return db.recommendations.bulkPut( data );
  } );
} );

const recommendations = document.querySelector( 'sa-recommendations' );
recommendations.addEventListener( 'sa-about', () => {
  about.hidden = false;
} );
recommendations.addEventListener( 'sa-favorite', ( evt ) => {

} );
recommendations.addEventListener( 'sa-favorites', ( evt ) => {
  recommendations.hidden = true;
  favorites.hidden = false;
} );

const db = new Dexie( 'StogieAwesome' );
db.version( 1 ).stores( {
  favorites: 'id, name',
  recommendations: 'id, name'
} );
db.recommendations.toArray()
.then( ( data ) => { 
  if( data.length > 0 ) {
    recommendations.items = data;
    landing.hidden = true;
    recommendations.hidden = false;
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
