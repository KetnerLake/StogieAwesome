customElements.define( 'sa-landing', class extends HTMLElement {
  constructor() {
    super();

    // Properties
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    // Elements
    this.$catalog = this.querySelector( 'sa-catalog' );
    this.$catalog.addEventListener( 'sa-change', ( evt ) => {
      if( evt.detail.count === null ) {
        this.$recommend.disabled = true;        
      } else {
        this.$recommend.disabled = evt.detail.count >= 3 ? false : true;
      }
    } );

    this.$pick = this.querySelector( '#go' );
    this.$pick.addEventListener( this._touch, () => {
      fetch( 'https://cigardojo.com/category/cigars/feed/' )
      .then( ( response ) => response.text() ) 
      .then( ( data ) => {
        console.log( data );
      } );
    } );

    this.$recommend = this.querySelector( '#recommend' );
    this.$recommend.addEventListener( this._touch, () => {
      this.$catalog.clear( false );
      this.$recommend.disabled = true;

      this.dispatchEvent( new CustomEvent( 'sa-recommend', {
        detail: {
          favorites: this.$catalog.favorites
        }
      } ) );      
    } );
  }

  // Promote properties
  // Values may be set before module load  
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  // Set up
  connectedCallback() {
    this._upgrade( 'catalog' );
    this._upgrade( 'favorites' );    
    this._upgrade( 'hidden' );        
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'hidden'
    ];
  } 

  // Properties
  // Not reflected
  // Array, Date, Object, null  
  get catalog() {
    return this.$catalog.items;
  }

  set catalog( value ) {
    this.$catalog.items = value;
  }  

  get favorites() {
    return this.$catalog.favorites;
  }

  set favorites( value ) {
    this.$catalog.favorites = value;
  }    

  // Attributes
  // Reflected
  // Boolean, Float, Integer, String, null
  get hidden() {
    return this.hasAttribute( 'hidden' );
  }

  set hidden( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hidden' );
      } else {
        this.setAttribute( 'hidden', '' );
      }
    } else {
      this.removeAttribute( 'hidden' );
    }
  }         
} );
