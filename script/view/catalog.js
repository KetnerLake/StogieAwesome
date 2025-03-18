customElements.define( 'sa-catalog', class extends HTMLElement {
  constructor() {
    super();

    // Properties
    this._favorites = [];    
    this._items = [];
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';    

    // Events
    this.doItemClick = this.doItemClick.bind( this );

    // Elements
    this.$field = this.querySelector( 'sa-text-field' );
    this.$field.addEventListener( 'sa-change', ( evt ) => {
      if( evt.detail.value === null ) {
        this.open = false;
        return;
      }

      let matches = this._items.filter( ( value ) => this._favorites.indexOf( value ) >= 0 ? false : true );
      matches = matches.filter( ( value ) => value.toLowerCase().indexOf( evt.detail.value.toLowerCase() ) >= 0 ? true : false ).slice( 0, 5 );

      while( this.$menu.children.length > matches.length ) {
        this.$menu.children[0].removeEventListener( this._touch, this.doItemClick );
        this.$menu.children[0].remove();
      }

      while( this.$menu.children.length < matches.length ) {
        const item = document.createElement( 'li' );
        item.addEventListener( this._touch, this.doItemClick );
        this.$menu.appendChild( item );        
      }

      for( let c = 0; c < this.$menu.children.length; c++ ) {
        this.$menu.children[c].textContent = matches[c];
      }

      this.open = true;
    } );

    this.$list = this.querySelector( 'sa-list' );
    this.$list.addEventListener( 'sa-remove', ( evt ) => {
      const index = this._favorites.indexOf( evt.detail.value );
      this._favorites.splice( index, 1 );
      this.$list.items = this._favorites;
      this.open = false;
      this.$tag.textContent = this._favorites.length === 0 ? '' : this._favorites.length;

      if( this.minimum !== null ) {
        if( this._favorites.length === this.minimum ) {
          this.dispatchEvent( new CustomEvent( 'sa-catalog-minimum', {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: {
              minimum: this.minimum
            }
          } ) );
          // return;
        }
      }

      this.dispatchEvent( new CustomEvent( 'sa-change', {
        detail: {
          count: this._favorites.length === 0 ? null : this._favorites.length,
          favorites: this._favorites.length === 0 ? null : this._favorites
        }
      } ) );      
    } );

    this.$menu = this.querySelector( 'ul' );

    this.$tag = this.querySelector( 'sa-tag' );
    this.$tag.addEventListener( 'sa-remove', () => {
      this.$tag.textContent = '';
      this._favorites = [];
      this.$list.items = this._favorites;
      this.open = false;
      this.clear( false );

      this.dispatchEvent( new CustomEvent( 'sa-change', {
        detail: {
          count: this._favorites.length === 0 ? null : this._favorites.length,
          favorites: this._favorites.length === 0 ? null : this._favorites
        }
      } ) );            
    } );
  }

  clear( focus = true ) {
    this.$field.clear( focus );
  }

  focus() {
    this.$field.focus();
  }

  doItemClick( evt ) {
    this._favorites.push( evt.currentTarget.textContent );
    this._favorites.sort( ( a, b ) => {
      if( a > b ) return 1;
      if( a < b ) return -1;
      return 0;
    } );
    this.$list.items = this._favorites;
    this.open = false;

    this.$tag.textContent = this._favorites.length;
    this.clear();

    this.dispatchEvent( new CustomEvent( 'sa-change', {
      detail: {
        count: this._favorites.length === 0 ? null : this._favorites.length,
        favorites: this._favorites.length === 0 ? null : this._favorites
      }
    } ) );
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

  // Setup
  connectedCallback() {
    this._upgrade( 'favorites' );
    this._upgrade( 'items' );
    this._upgrade( 'minimum' );    
    this._upgrade( 'open' );     
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'minimum',
      'open'
    ];
  }

  // Properties
  // Not reflected
  // Array, Date, Object, null
  get favorites() {
    return this._favorites;
  }

  set favorites( value ) {
    this._favorites = value === null ? [] : [... value];
    this.$list.items = this._favorites;
    this.$tag.hidden = this._favorites.length === 0 ? true : false;
    this.$tag.textContent = this._favorites.length === 0 ? '' : this._favorites.length;
  }    

  get items() {
    return this._items;
  }

  set items( value ) {
    this._items = value === null ? [] : [... value];
  }  

  // Attributes
  // Reflected
  // Boolean, Float, Integer, String, null
  get minimum() {
    if( this.hasAttribute( 'minimum' ) ) {
      return parseInt( this.getAttribute( 'minimum' ) );
    }

    return null;
  }

  set minimum( value ) {
    if( value !== null ) {
      this.setAttribute( 'minimum', value );
    } else {
      this.removeAttribute( 'minimum' );
    }
  }  

  get open() {
    return this.hasAttribute( 'open' );
  }

  set open( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'open' );
      } else {
        this.setAttribute( 'open', '' );
      }
    } else {
      this.removeAttribute( 'open' );
    }
  }     
} );
