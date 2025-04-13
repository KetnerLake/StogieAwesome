customElements.define( 'sa-about', class extends HTMLElement {
  constructor() {
    super();

    // Properties
    this._timeout = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    // Elements
    this.$close = this.querySelector( '#close' );
    this.$close.addEventListener( this._touch, () => {
      this.dispatchEvent( new CustomEvent( 'sa-close' ) );
    } );

    this.$email = this.querySelector( '#email' );
    this.$email.addEventListener( 'sa-change', () => this.validate() );

    this.$face = this.querySelector( '#face' );
    this.$face.addEventListener( ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'mousedown', ( evt ) => {
      evt.preventDefault();
      this._timeout = setTimeout( () => {
        this._timeout = null;
        this.dispatchEvent( new CustomEvent( 'sa-reset' ) );
      }, 5000 );
    } );
    this.$face.addEventListener( ( 'ontouchstart' in document.documentElement ) ? 'touchend' : 'mouseup', () => {
      if( this._timeout !== null ) {
        clearTimeout( this._timeout );
        this._timeout = null;
      }
    } );

    this.$flavor = this.querySelector( '#flavor' );
    this.$flavor.addEventListener( 'sa-change', () => {
      if( this.$flavor.value === null ) {
        this.$notify.disabled = true;
        return;
      }
  
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if( !regex.test( this.$flavor.value ) ) {
        this.$notify.disabled = true;
        return;
      }      

      this.$notify.disabled = false;
    } );    

    this.$message = this.querySelector( '#message' );
    this.$message.addEventListener( 'sa-change', () => this.validate() );    

    this.$notify = this.querySelector( '#notify' );
    this.$notify.addEventListener( this._touch, () => {
      this.$notify.disabled = true;
      this.dispatchEvent( new CustomEvent( 'sa-notify', {
        detail: {
          subject: '[Stogie Awesome] Add to Notifications',
          message: `Add ${this.$flavor.value} to the Flavor Awesome notification email list.`
        }
      } ) );
    } );

    this.$send = this.querySelector( '#send' );
    this.$send.addEventListener( this._touch, () => {
      this.$send.disabled = true;
      this.dispatchEvent( new CustomEvent( 'sa-message', {
        detail: {
          subject: '[Stogie Awesome] Message',
          message: `${this.$email.value} says:<br>${this.$message.value}`
        }
      } ) );
    } );

    this.$stack = this.querySelector( 'sa-stack' );

    this.$tabs = this.querySelector( 'sa-tab-group' );
    this.$tabs.addEventListener( 'sa-change', ( evt ) => this.$stack.selectedIndex = evt.detail.selectedIndex );
  }

  clear() {
    this.$flavor.value = null;
    this.$notify.disabled = true;

    this.$email.value = null;
    this.$message.value = null;
    this.$send.disabled = true;
  }

  hide() {
    const theme = document.querySelector( 'meta[name=theme-color]' );
    theme.setAttribute( 'content', '#f4f4f4' );

    return this.animate(
      [
        {top: 0},
        {top: '100vh'}        
      ], {
        duration: 350,
        easing: 'cubic-bezier( 0.42, 0, 0.58, 1 )',        
        fill: 'forwards'
      }
    ).finished;
  }  

  reset() {
    this.$tabs.selectedIndex = 0;    
    this.$stack.selectedIndex = 0;
    this.clear();    
  }

  show() {
    const theme = document.querySelector( 'meta[name=theme-color]' );
    theme.setAttribute( 'content', '#161616' );

    this.animate(
      [
        {top: '100vh'}, 
        {top: 0}
      ], {
        duration: 600,
        easing: 'cubic-bezier( 0.42, 0, 0.58, 1 )',        
        fill: 'forwards'
      }
    );
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
