customElements.define( 'sa-landing', class extends HTMLElement {
  constructor() {
    super();

    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    this.$catalog = this.querySelector( 'sa-catalog' );
    this.$catalog.addEventListener( 'sa-change', ( evt ) => {
      if( evt.detail.count === null ) {
        this.$recommend.disabled = true;        
      } else {
        this.$recommend.disabled = evt.detail.count >= 3 ? false : true;
      }
    } );

    this.$recommend = this.querySelector( 'sa-button' );
    this.$recommend.addEventListener( this._touch, () => {
      // this.$select.open = false;      
      this.$recommend.disabled = true;

      this.dispatchEvent( new CustomEvent( 'sa-recommend', {
        detail: {
          favorites: this.$catalog.favorites
        }
      } ) );      
    } );
  }

  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  connectedCallback() {
    this._upgrade( 'catalog' );
    this._upgrade( 'favorites' );    
  }

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
} );
