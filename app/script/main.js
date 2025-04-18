/*
 * About
 */

const about = document.querySelector( 'sa-about' );
about.addEventListener( 'sa-close', () => {
  about.hide().then( () => about.reset() );
} );
about.addEventListener( 'sa-message', ( evt ) => {
  alert.message = 'Thanks for reaching out! I will be in touch.';
  dialog.showModal();
    
  fetch( '/api/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( evt.detail )
  } )
  .then( ( response ) => response.text() )
  .then( () => {
    about.clear();
  } );
} );
about.addEventListener( 'sa-notify', ( evt ) => {
  alert.message = 'Thanks for reaching out! I will be in touch.';
  dialog.showModal();

  fetch( '/api/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( evt.detail )
  } )
  .then( ( response ) => response.text() )
  .then( () => {
    about.clear();
  } );
} );
about.addEventListener( 'sa-reset', () => {
  const response = window.confirm( 'Reset all data?' );
  if( response ) {
    window.localStorage.removeItem( 'awesome_got_it' );
    db.catalog.toArray()
    .then( ( data ) => {
      data = data.map( ( value ) => value.id );
      return db.catalog.bulkDelete( data );
    } )
    .then( () => db.favorites.toArray() )
    .then( ( data ) => {
      data = data.map( ( value ) => value.id );
      return db.favorites.bulkDelete( data );
    } )
    .then( () => db.recommendations.toArray() )
    .then( ( data ) => {
      data = data.map( ( value ) => value.id );
      return db.recommendations.bulkDelete( data );
    } )
    .then( () => window.location.reload() );
  }
} );

/*
 * Alert
 */

const alert = document.querySelector( 'sa-alert' );
alert.addEventListener( 'sa-dismiss', () => {
  dialog.close();
  favorites.focus();
} );

const dialog = document.querySelector( 'dialog' ); 

/*
 * Favorites
 */

const favorites = document.querySelector( 'sa-favorites' );
favorites.addEventListener( 'sa-add', ( evt ) => {
  db.favorites.put( {
    id: self.crypto.randomUUID(),
    catalog_id: evt.detail.value.id,
    name: evt.detail.value.name
  } )
  .then( () => db.favorites.toArray() )
  .then( ( data ) => {
    data.sort( ( a, b ) => {
      if( a.name > b.name ) return 1;
      if( a.name < b.name ) return -1;
      return 0;
    } );
    favorites.items = data;
  } );
} );
favorites.addEventListener( 'sa-delete', ( evt ) => {
  db.favorites.where( {name: evt.detail.value.name} ).first()
  .then( ( data ) => db.favorites.delete( data.id ) )
  .then( () => db.favorites.toArray() )
  .then( ( data ) => {
    data.sort( ( a, b ) => {
      if( a.name > b.name ) return 1;
      if( a.name < b.name ) return -1;
      return 0;
    } );
    favorites.items = data;
  } );  
} );
/*
favorites.addEventListener( 'sa-favorite', ( evt ) => {
  db.favorites.where( {catalog_id: evt.detail.value.id} ).toArray()
  .then( ( data ) => {
    if( data.length === 0 ) {
      db.favorites.put( {
        id: self.crypto.randomUUID(),
        catalog_id: evt.detail.value.id,
        name: evt.detail.value.name
      } )
      .then( () => db.favorites.toArray() )
      .then( ( data ) => {
        data.sort( ( a, b ) => {
          if( a.name > b.name ) return 1;
          if( a.name < b.name ) return -1;
          return;
        } );        
        favorites.items = data.length === 0 ? null : data;
      } );
    } else {
      db.favorites.delete( data[0].id )
      .then( () => db.favorites.toArray() )
      .then( ( data ) => {
        data.sort( ( a, b ) => {
          if( a.name > b.name ) return 1;
          if( a.name < b.name ) return -1;
          return;
        } );
        favorites.items = data.length === 0 ? null : data;
      } );
    }
  } );
} );
*/
favorites.addEventListener( 'sa-minimum', () => {
  alert.message = 'You must have at least three favorites.';
  dialog.showModal();
} );
favorites.addEventListener( 'sa-recommendations', () => {
  if( favorites.changed ) {
    favorites.changed = false;
    recommendations.changed = false;
    recommendations.items = null;

    db.recommendations.toArray()
    .then( ( data ) => {
      data = data.map( ( value ) => value.id );
      return db.recommendations.bulkDelete( data ); 
    } )
    db.favorites.toArray()
    .then( ( data ) => makeRecommendation( data ) )
    .then( ( data ) => {
      data.recommendations = data.recommendations.map( ( value ) => {
        value.id = self.crypto.randomUUID();
        value.favorite = false;
        return value;
      } );
      data.recommendations.sort( ( a, b ) => {
        if( a.name > b.name ) return 1;
        if( a.name < b.name ) return -1;
        return 0;
      } );
      recommendations.items = data.recommendations;
      return db.recommendations.bulkPut( data.recommendations );
    } );
  }

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
/*
favorites.addEventListener( 'sa-remove', ( evt ) => {
  db.favorites.delete( evt.detail.value.id )
  .then( () => db.favorites.toArray() )
  .then( ( data ) => {
    data.sort( ( a, b ) => {
      if( a.name > b.name ) return 1;
      if( a.name < b.name ) return -1;
      return 0;
    } );
    favorites.items = data.length === 0 ? null : data;
  } );
} );
*/

/*
 * Landing
 */

const landing = document.querySelector( 'sa-landing' );
landing.addEventListener( 'sa-add', ( evt ) => {
  db.favorites.put( {
    id: self.crypto.randomUUID(),
    catalog_id: evt.detail.value.id,
    name: evt.detail.value.name
  } )
  .then( () => db.favorites.toArray() )
  .then( ( data ) => {
    data.sort( ( a, b ) => {
      if( a.name > b.name ) return 1;
      if( a.name < b.name ) return -1;
      return 0;
    } );
    landing.favorites = data;
    favorites.items = data;
  } );
} );
landing.addEventListener( 'sa-recommend', ( evt ) => {
  recommendations.animate( [
    {left: '100vw'},
    {left: '0'}        
  ], {
    duration: 350,
    easing: 'cubic-bezier( 0.42, 0, 0.58, 1 )',        
    fill: 'forwards'
  } ).finished.then( () => landing.hidden = true );

  db.favorites.toArray()
  .then( ( data ) => makeRecommendation( data ) )
  .then( ( data ) => {
    data.recommendations = data.recommendations.map( ( value ) => {
      value.id = self.crypto.randomUUID();
      value.favorite = false;
      return value;
    } );
    data.recommendations.sort( ( a, b ) => {
      if( a.name > b.name ) return 1;
      if( a.name < b.name ) return -1;
      return 0;
    } );
    recommendations.items = data.recommendations;
    return db.recommendations.bulkPut( data.recommendations );
  } );
} );
landing.addEventListener( 'sa-delete', ( evt ) => {
  db.favorites.where( {name: evt.detail.value.name} ).first()
  .then( ( data ) => db.favorites.delete( data.id ) )
  .then( () => db.favorites.toArray() )
  .then( ( data ) => {
    data.sort( ( a, b ) => {
      if( a.name > b.name ) return 1;
      if( a.name < b.name ) return -1;
      return 0;
    } );
    landing.favorites = data;
    favorites.items = data;
  } );
} );

/*
 * Recommendations
 */

const recommendations = document.querySelector( 'sa-recommendations' );
recommendations.addEventListener( 'sa-about', () => {
  about.show();
} );
recommendations.addEventListener( 'sa-favorite', async ( evt ) => {
  // favorites.changed = recommendations.changed;

  let catalog = await db.catalog.where( {name: evt.detail.value.name} ).toArray();
  let catalog_id = null;
  if( catalog.length === 0 ) {    
    catalog_id = self.crypto.randomUUID();
    await db.catalog.put( {
      id: catalog_id,
      name: evt.detail.value.name
    } );
    catalog = await db.catalog.toArray();
    catalog.sort( ( a, b ) => {
      if( a.name > b.name ) return 1;
      if( a.name < b.name ) return -1;
      return 0;
    } );
    favorites.catalog = catalog;
  } else {
    catalog_id = catalog[0].id;
  }

  let faves = await db.favorites.where( {catalog_id: catalog_id} ).toArray();
  if( faves.length === 0 ) {
    await db.favorites.put( {
      id: self.crypto.randomUUID(),
      catalog_id: catalog_id,
      name: evt.detail.value.name
    } );
    evt.detail.value.favorite = true;
  } else {
    await db.favorites.delete( faves[0].id );
    evt.detail.value.favorite = false;    
  }
  faves = await db.favorites.toArray();
  faves.sort( ( a, b ) => {
    if( a.name > b.name ) return 1;
    if( a.name < b.name ) return -1;
    return 0;
  } );
  favorites.items = faves.length === 0 ? null : faves;

  await db.recommendations.put( evt.detail.value );
  const recommends = await db.recommendations.toArray();
  recommends.sort( ( a, b ) => {
    if( a.name > b.name ) return 1;
    if( a.name < b.name ) return -1;
    return 0;
  } );
  recommendations.items = recommends;
} );
recommendations.addEventListener( 'sa-favorites', () => {
  favorites.changed = recommendations.changed;
  
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
  db.recommendations.toArray()
  .then( ( data ) => {
    data = data.map( ( value ) => value.id );
    return db.recommendations.bulkDelete( data );
  } )
  .then( () => db.favorites.toArray() )
  .then( ( data ) => makeRecommendation( data ) )
  .then( ( data ) => {
    data.recommendations = data.recommendations.map( ( value ) => {      
      value.id = self.crypto.randomUUID();
      value.favorite = false;
      return value;
    } );
    data.recommendations.sort( ( a, b ) => {
      if( a.name > b.name ) return 1;
      if( a.name < b.name ) return -1;
      return 0;
    } );
    recommendations.items = data.recommendations;
    return db.recommendations.bulkPut( data.recommendations );
  } );
} );

/*
 * Setup
 */

const db = new Dexie( 'StogieAwesome' );
db.version( 3 ).stores( {
  catalog: 'id, name',
  favorites: 'id, catalog_id, name',
  recommendations: 'id, name'
} );

loadCatalog()
.then( () => db.catalog.toArray() )
.then( ( data ) => {
  data.sort( ( a, b ) => {
    if( a.name > b.name ) return 1;
    if( a.name < b.name ) return -1;
    return 0;
  } );
  landing.catalog = data;
  favorites.catalog = data;
  return db.recommendations.toArray();
} )
.then( ( data ) => { 
  if( data.length > 0 ) {
    data.sort( ( a, b ) => {
      if( a.name > b.name ) return 1;
      if( a.name < b.name ) return -1;
      return 0;
    } );

    favorites.style.left = '-50vw';
    recommendations.items = data;    
    recommendations.style.left = '0';
  } else {
    landing.hidden = false;
  }

  return db.favorites.toArray();
} )
.then( ( data ) => {
  data.sort( ( a, b ) => {
    if( a.name > b.name ) return 1;
    if( a.name < b.name ) return -1;
    return 0;
  } );

  landing.favorites = data.length === 0 ? null : data;
  favorites.items = data.length === 0 ? null : data;
} );

async function loadCatalog( url = '/data/catalog.json' ) {
  const size = await db.catalog.toArray().length;
  if( size === 0 ) {
    let data = await fetch( url ).then( ( response ) => response.json() );
    data = data.map( ( value ) => {
      return {
        id: self.crypto.randomUUID(),
        name: value
      }
    } );
    await db.catalog.bulkPut( data );
  } else {
    const data = await fetch( url ).then( ( response ) => response.json() );
    const existing = await db.catalog.toArray();

    let incoming = data.filter( ( value ) => existing.some( ( item ) => item.name === value ) ? false : true );
    incoming = incoming.map( ( value ) => {
      return {
        id: self.crypto.randomUUID(),
        name: value
      }
    } );

    await db.catalog.bulkPut( incoming );      
  }
}

function makeRecommendation( cigars ) {
  return fetch( '/api/expert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( cigars )
  } )
  .then( ( response ) => response.json() );    
}
