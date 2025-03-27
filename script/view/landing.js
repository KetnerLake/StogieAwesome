customElements.define( 'sa-landing', class extends HTMLElement {
  constructor() {
    super();

    // Properties
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    // Elements
    this.$catalog = this.querySelector( 'sa-catalog' );

    this.$recommend = this.querySelector( '#recommend' );
    this.$recommend.addEventListener( this._touch, () => {
      this.$catalog.reset();
      this.$recommend.disabled = true;
      this.dispatchEvent( new CustomEvent( 'sa-recommend' ) );      
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

    if( this.$catalog.favorites !== null ) {
      this.$recommend.disabled = this.$catalog.favorites.length >= 3 ? false : true;
    }
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
