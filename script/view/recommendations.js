customElements.define( 'sa-recommendations', class extends HTMLElement {
  constructor() {
    super();

    // Properties
    this._items = [];
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    // Elements
    this.$favorites_going = this.querySelector( '#favorites_going' );
    this.$favorites_going.addEventListener( this._touch, () => {
      this.dispatchEvent( new CustomEvent( 'sa-favorites' ) );
    } );
    this.$favorites_nav = this.querySelector( '#favorites_nav' );
    this.$favorites_nav.addEventListener( this._touch, () => {
      this.dispatchEvent( new CustomEvent( 'sa-favorites' ) );
    } );    
    this.$going = this.querySelector( '#going' );
    this.$got = this.querySelector( '#got' );
    this.$got.addEventListener( this._touch, () => {
      this.$going.hidden = true;
      window.localStorage.setItem( 'stogie_got', '1' );
    } );
    this.$list = this.querySelector( 'sa-list' );    

    const first = window.localStorage.getItem( 'stogie_got' );
    this.$going.hidden = first === null ? false : true;
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
    this._upgrade( 'items' );
  }

  // Properties
  // Not reflected
  // Array, Date, Object, null  
  get items() {
    return this.$list.items;
  }

  set items( value ) {
    this.$list.items = value === null ? [] : [... value];
  }  
} );
