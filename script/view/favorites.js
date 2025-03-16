customElements.define( 'sa-favorites', class extends HTMLElement {
  constructor() {
    super();

    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    this.$catalog = this.querySelector( 'sa-catalog' );
    this.$recommendations = this.querySelector( 'sa-button' );
    this.$recommendations.addEventListener( this._touch, () => {
      if( this.$catalog.favorites === null ) {
        this.dispatchEvent( new CustomEvent( 'sa-minimum' ) );
        return;
      }
        
      if( this.$catalog.favorites.length < 3 ) {
        this.dispatchEvent( new CustomEvent( 'sa-minimum' ) );
        return;
      }

      this.dispatchEvent( new CustomEvent( 'sa-recommendations' ) );
    } );
  }

  focus() {
    this.$catalog.focus();
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
    this._upgrade( 'items' );
  }

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
    this.$catalog.favorites = value;
  }  
} );
