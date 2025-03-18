customElements.define( 'sa-about', class extends HTMLElement {
  constructor() {
    super();

    // Properties
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    // Elements
    this.$close = this.querySelector( '#close' );
    this.$close.addEventListener( this._touch, () => {
      this.dispatchEvent( new CustomEvent( 'sa-close' ) );
    } );

    this.$email = this.querySelector( '#email' );
    this.$email.addEventListener( 'sa-change', () => this.validate() );

    this.$message = this.querySelector( '#message' );
    this.$message.addEventListener( 'sa-change', () => this.validate() );    

    this.$send = this.querySelector( '#send' );
    this.$send.addEventListener( this._touch, () => {
      this.dispatchEvent( new CustomEvent( 'sa-message', {
        detail: {
          email: this.$email.value,
          message: this.$message.value
        }
      } ) );
    } );

    this.$stack = this.querySelector( 'sa-stack' );

    this.$tabs = this.querySelector( 'sa-tab-group' );
    this.$tabs.addEventListener( 'sa-change', ( evt ) => this.$stack.selectedIndex = evt.detail.selectedIndex );
  }

  clear() {
    this.$email.value = null;
    this.$message.value = null;
    this.$send.disabled = true;
  }

  reset() {
    this.$tabs.selectedIndex = 0;    
    this.$stack.selectedIndex = 0;
    this.clear();    
  }

  validate() {
    if( this.$email.value === null ) {
      this.$send.disabled = true;
      return;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if( !regex.test( this.$email.value ) ) {
      this.$send.disabled = true;
      return;
    }

    if( this.$message.value === null ) {
      this.$send.disabled = true;
      return;
    }    

    this.$send.disabled = false;
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
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'hidden'
    ];
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
