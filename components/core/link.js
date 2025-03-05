export default class StogieLink extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-block;
          position: relative;
        }

        :host( [hidden] ) {
          display: none;
        }

        button {
          align-items: center;
          background: none;
          border: none;
          box-sizing: border-box;
          color: #0f62fe;
          cursor: pointer;
          display: flex;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 16px;
          margin: 0;
          padding: 0;
          text-rendering: optimizeLegibility;
          -webkit-tap-highlight-color: transparent;           
        }

        :host( [disabled] ) button {
          color: #16161640;
          cursor: not-allowed;
        }

        :host( [inline] ) button {
          text-decoration: underline;
        }
      </style>
      <button part="button" type="button">
        <slot></slot>
      </button>
    `;
    
    // Private
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';    

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$button.addEventListener( this._touch, () => {
      if( this.href !== null ) {
        window.open( this.href, '_blank' );
      }

      this.dispatchEvent( new CustomEvent( 'sa-link', {
        detail: {
          href: this.href
        }
      } ) );
    } );
  }

  // When attributes change
  _render() {
    this.$button.disabled = this.disabled;
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
    this._upgrade( 'disabled' );              
    this._upgrade( 'hidden' );          
    this._upgrade( 'inline' );              
    this._upgrade( 'href' );          
    this._render();
  }
  
  // Set down
  diconnectedCallback() {;}

  // Watched attributes
  static get observedAttributes() {
    return [
      'disabled',
      'hidden',
      'inline',
      'href'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  } 
  
  // Attributes
  // Reflected
  // Boolean, Float, Integer, String, null
  get disabled() {
    return this.hasAttribute( 'disabled' );
  }

  set disabled( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'disabled' );
      } else {
        this.setAttribute( 'disabled', '' );
      }
    } else {
      this.removeAttribute( 'disabled' );
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

  get href() {
    if( this.hasAttribute( 'href' ) ) {
      return this.getAttribute( 'href' );
    }

    return null;
  }

  set href( value ) {
    if( value !== null ) {
      this.setAttribute( 'href', value );
    } else {
      this.removeAttribute( 'href' );
    }
  }  
  
  get inline() {
    return this.hasAttribute( 'inline' );
  }

  set inline( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'inline' );
      } else {
        this.setAttribute( 'inline', '' );
      }
    } else {
      this.removeAttribute( 'inline' );
    }
  }  
}

window.customElements.define( 'sa-link', StogieLink );
