export default class StogieText extends HTMLElement {
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

        p {
          box-sizing: border-box;
          color: var( --text-color, #161616 );
          cursor: var( --text-cursor, default );
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: var( --text-font-size, 16px );
          font-style: normal;
          font-weight: var( --text-font-weight, 400 );
          line-height: var( --text-line-height, 20px );
          margin: 0;
          padding: 0;
          text-rendering: optimizeLegibility;
        }

        :host( [size=s] ) p {
          font-size: 14px;
          line-height: 18px;
        }
        :host( [size=l] ) p {
          font-size: 18px;
          line-height: 22px;
        }        
        :host( [size=xl] ) p {
          font-size: 24px;
          line-height: 30px;
        }        

        :host( [weight=bold] ) p {
          font-weight: 600;
        }

        :host( [truncate] ) p {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        ::slotted( strong ) {
          font-weight: 600;
        }
      </style>
      <p part="text">
        <slot></slot>
      </p>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );
  }

  // When attributes change
  _render() {;}

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
    this._upgrade( 'hidden' );    
    this._upgrade( 'size' );  
    this._upgrade( 'truncate' );          
    this._upgrade( 'weight' );      
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'hidden',
      'size',
      'truncate',
      'weight'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  } 

  // Attributes
  // Reflected
  // Boolean, Number, String, null
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

  get size() {
    if( this.hasAttribute( 'size' ) ) {
      return parseInt( this.getAttribute( 'size' ) );
    }

    return null;
  }

  set size( value ) {
    if( value !== null ) {
      this.setAttribute( 'size', value );
    } else {
      this.removeAttribute( 'size' );
    }
  }  

  get truncate() {
    return this.hasAttribute( 'truncate' );
  }

  set truncate( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'truncate' );
      } else {
        this.setAttribute( 'truncate', '' );
      }
    } else {
      this.removeAttribute( 'truncate' );
    }
  }

  get weight() {
    if( this.hasAttribute( 'weight' ) ) {
      return this.getAttribute( 'weight' );
    }

    return null;
  }

  set weight( value ) {
    if( value !== null ) {
      this.setAttribute( 'weight', value );
    } else {
      this.removeAttribute( 'weight' );
    }
  }      
}

window.customElements.define( 'sa-text', StogieText );
