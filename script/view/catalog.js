customElements.define( 'sa-catalog', class extends HTMLElement {
  constructor() {
    super();

    // Properties
    this._items = [];
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'mousedown';    

    // Elements
    this.$done = this.querySelector( 'sa-box sa-button' );
    this.$done.addEventListener( this._touch, ( evt ) => {
      evt.preventDefault();

      const theme = document.querySelector( 'meta[name=theme-color]' );
      theme.setAttribute( 'content', '#f4f4f4' );
      document.body.style.backgroundColor = '#f4f4f4';      
  
      this.search = false;

      this.$field.value = null;
      this.$field.blur();
      this.$done.hidden = !this.search;
      this.$inline.hidden = !this.search;
      this.$search_label.hidden = !this.search;
      this.$search.hidden = !this.search;
      this.$search.items = null;
      this.$favorites.hidden = this.search;

      this.dispatchEvent( new CustomEvent( 'sa-change' ) );
    } );

    this.$favorites = this.querySelector( 'sa-list[item-renderer=sa-favorite-item]' );    
    this.$favorites.addEventListener( 'sa-change', ( evt ) => {
      const favorites = this.$favorites.items === null ? [] : [... this.$favorites.items];
      const index = favorites.findIndex( ( value ) => value.name === evt.detail.value.name ? true : false );
      favorites.splice( index, 1 );

      this.$favorites.items = favorites; 
      this.$inline.items = favorites;      
      this.$inline_label.hidden = favorites.length === 0 ? true : false;

      this.dispatchEvent( new CustomEvent( 'sa-delete', {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: {
          value: evt.detail.value
        } 
      } ) );      
    } );

    this.$field = this.querySelector( 'sa-search-field' );
    this.$field.addEventListener( 'focus', () => {
      const theme = document.querySelector( 'meta[name=theme-color]' );
      theme.setAttribute( 'content', '#eaf3ff' );
      document.body.style.backgroundColor = '#eaf3ff';

      this.search = true;

      this.$done.hidden = !this.search;
      this.$inline.hidden = this.$inline.items === null ? true : false;
      this.$inline_label.hidden = this.$inline.items === null ? true : false;
      this.$favorites.hidden = this.search;
    } );
    this.$field.addEventListener( 'sa-change', ( evt ) => {
      this.$inline_label.hidden = this.$inline.items === null ? true : false;
      this.$inline.hidden = this.$inline.items === null ? true : false;       

      this.$search_label.hidden = evt.detail.value === null ? true : false;        
      this.$search.hidden = evt.detail.value === null ? true : false;                

      if( evt.detail.value !== null ) {
        this.match( evt.detail.value );
      }
    } );

    this.$inline = this.querySelector( 'sa-list[item-renderer=sa-catalog-item]:nth-of-type( 1 )' );
    this.$inline.addEventListener( 'sa-change', ( evt ) => {
      const favorites = this.$inline.items === null ? [] : [... this.$inline.items];
      const index = favorites.findIndex( ( value ) => value.name === evt.detail.value.name ? true : false );
      favorites.splice( index, 1 );

      this.$inline.items = favorites;      
      this.$inline_label.hidden = favorites.length === 0 ? true : false;
      this.$inline.hidden = favorites.length === 0 ? true : false;
      this.$favorites.items = favorites;      

      if( this.$field.value !== null ) {
        this.match( this.$field.value );
      }

      this.dispatchEvent( new CustomEvent( 'sa-delete', {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: {
          value: evt.detail.value
        } 
      } ) );
    } );

    this.$inline_label = this.querySelector( 'sa-label[size=s]:nth-of-type( 1 )' );    
    
    this.$search = this.querySelector( 'sa-list[item-renderer=sa-catalog-item]:nth-of-type( 2 )' );
    this.$search.addEventListener( 'sa-change', ( evt ) => {
      const favorites = this.$inline.items === null ? [] : [... this.$inline.items];
      favorites.push( evt.detail.value );
      favorites.sort( ( a, b ) => {
        if( a.name > b.name ) return 1;
        if( a.name < b.name ) return -1;
        return 0;
      } );

      this.$inline.items = favorites;
      this.$inline_label.hidden = false;
      this.$inline.hidden = false;
      this.$favorites.items = favorites;

      if( this.$field.value !== null ) {
        this.match( this.$field.value );
      }

      this.dispatchEvent( new CustomEvent( 'sa-add', {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: {
          value: evt.detail.value
        } 
      } ) );
    } );

    this.$search_label = this.querySelector( 'sa-label[size=s]:nth-of-type( 2 )' );    
  }

  match( query ) {
    const matches = this._items.filter( ( value ) => value.name.toLowerCase().indexOf( query.toLowerCase() ) >= 0 ? true : false );

    if( this.$inline.items === null ) {
      this.$search.items = matches.slice( 0, 50 );
    } else {
      this.$search.items = matches.filter( ( item ) => {
        return !this.$inline.items.some( ( value ) => item.name === value.name ? true : false );
      } ).slice( 0, 50 );
    }
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
    this._upgrade( 'search' );
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'search'
    ];
  }

  // Properties
  // Not reflected
  // Array, Date, Object, null
  get favorites() {
    return this.$favorites.items;
  }

  set favorites( value ) {
    this.$inline.items = value === null ? [] : [... value];
    this.$inline_label.hidden = value === null ? true : false;
    this.$favorites.items = value === null ? [] : [... value];
  }    

  get items() {
    return this._items;
  }

  set items( value ) {
    this._items = value === null ? [] : [... value];

    if( this._items !== null ) {
      this._items = this._items.map( ( value ) => {
        value.checked = false;
        return value;
      } );
    }
  }  

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get search() {
    return this.hasAttribute( 'search' );
  }

  set search( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'search' );
      } else {
        this.setAttribute( 'search', '' );
      }
    } else {
      this.removeAttribute( 'search' );
    }
  }

  get search() {
    return this.hasAttribute( 'search' );
  }  
} );
