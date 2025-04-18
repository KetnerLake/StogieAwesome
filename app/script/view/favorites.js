customElements.define( 'sa-favorites', class extends HTMLElement {
  constructor() {
    super();

    // Properties
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    // Elements
    this.$catalog = this.querySelector( 'sa-catalog' );
    this.$catalog.addEventListener( 'sa-change', () => this.changed = true );
    
    this.$recommendations = this.querySelector( 'sa-button' );
    this.$recommendations.addEventListener( this._touch, () => {
      if( this.items === null ) {
        this.dispatchEvent( new CustomEvent( 'sa-minimum' ) );
        return;
      }
        
      if( this.items.length < 3 ) {
        this.dispatchEvent( new CustomEvent( 'sa-minimum' ) );
        return;
      }

      this.dispatchEvent( new CustomEvent( 'sa-recommendations' ) );
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
    this._upgrade( 'changed' );    
    this._upgrade( 'hidden' );    
    this._upgrade( 'items' );
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'changed',
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

  get items() {
    return this.$catalog.favorites;
  }

  set items( value ) {
    if( value !== null ) {
      for( let f = 0; f < value.length; f++ ) {
        value[f].checked = true;
      }
    }

    this.$catalog.favorites = value;
    this.changed = false;
  }  

  // Attributes
  // Reflected
  // Boolean, Float, Integer, String, null
  get changed() {
    return this.hasAttribute( 'changed' );
  }

  set changed( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'changed' );
      } else {
        this.setAttribute( 'changed', '' );
      }
    } else {
      this.removeAttribute( 'changed' );
    }
  } 

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
