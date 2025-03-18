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
    this.$link = this.querySelector( 'sa-link' );
    this.$link.addEventListener( this._touch, () => {
      this.dispatchEvent( new CustomEvent( 'sa-about' ) );
    } );
    this.$list = this.querySelector( 'sa-list' );
    this.$list.addEventListener( 'sa-favorite', ( evt ) => {
      this.$notification.hidden = false;
    } ); 
    this.$notification = this.querySelector( 'sa-notification' );
    this.$notification.addEventListener( 'sa-close', () => this.$notification.hidden = true );
    this.$refresh = this.querySelector( '#refresh' );
    this.$refresh.addEventListener( this._touch, () => {
      this.$refresh.hidden = true;
      this.dispatchEvent( new CustomEvent( 'sa-refresh' ) );
    } );

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
    this._upgrade( 'hidden' );
    this._upgrade( 'items' );
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
  get items() {
    return this.$list.items;
  }

  set items( value ) {
    this.$list.items = value === null ? [] : [... value];
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
