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
      this.reset();
    } );

    this.$field = this.querySelector( 'sa-search-field' );
    this.$field.addEventListener( 'focus', () => {
      document.body.style.backgroundColor = '#eaf3ff';
      this.$done.hidden = false;
      this.$favorites.hidden = true;
    } );
    this.$field.addEventListener( 'sa-change', ( evt ) => {
      if( evt.detail.value === null ) {
        this.$search.hidden = true;
        this.$favorites.hidden = this.$favorites.items === null ? false : true;        
        return;
      } else {
        this.$search.hidden = false;
        this.$favorites.hidden = true;
      }

      this.match( evt.detail.value );
    } );

    this.$search = this.querySelector( 'sa-list[item-renderer=sa-catalog-item]' );
    this.$favorites = this.querySelector( 'sa-list[item-renderer=sa-favorite-item]' );    
  }

  match( query ) {
    let matches = this._items.filter( ( value ) => value.name.toLowerCase().indexOf( query.toLowerCase() ) >= 0 ? true : false );

    if( query.length < 3 ) {
      matches = matches.splice( 0, 5 );
    }

    matches.map( ( value ) => {
      if( this.$favorites.items === null ) {
        value.checked = false;
      } else {
        const index = this.$favorites.items.findIndex( ( item ) => item.name === value.name  );
        value.checked = index >= 0 ? true : false;
      }

      return value;
    } );
    
    this.$search.items = matches;
  }

  reset() {
    document.body.style.backgroundColor = '#f4f4f4';      
    this.$field.value = null;
    this.$field.blur();
    this.$done.hidden = true;
    this.$search.hidden = true;
    this.$search.items = null;
    this.$favorites.hidden = false;
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
  }

  // Properties
  // Not reflected
  // Array, Date, Object, null
  get favorites() {
    return this.$favorites.items;
  }

  set favorites( value ) {
    this.$favorites.items = value === null ? [] : [... value];
    if( this.$field.value !== null ) {
      this.match( this.$field.value );
    }
  }    

  get items() {
    return this._items;
  }

  set items( value ) {
    this._items = value === null ? [] : [... value];
  }  
} );
