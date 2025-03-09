export default class StogieIcon extends HTMLElement {
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

        i {
          box-sizing: border-box;
          color: var( --icon-color, #161616 );
          cursor: var( --icon-cursor, default );
          direction: ltr;
          display: flex;
          font-family: 'Material Symbols';
          font-size: var( --icon-size, 20px );
          font-style: normal;
          font-weight: normal;
          height: var( --icon-size, 20px );
          letter-spacing: normal;
          line-height: var( --icon-size, 20px );
          margin: 0;
          max-height: var( --icon-size, 20px );
          max-width: var( --icon-size, 20px );
          min-height: var( --icon-size, 20px );
          min-width: var( --icon-size, 20px );
          padding: 0;
          text-align: center;
          text-rendering: optimizeLegibility;
          text-transform: none;
          white-space: nowrap;
          width: var( --icon-size, 20px );
          word-wrap: normal;  
        }

        :host( [size=s] ) i {
          font-size: 16px;
          height: 16px;
          line-height: 16px;
          max-height: 16px;
          max-width: 16px;
          min-height: 16px;
          min-width: 16px;
          width: 16px;
        }

        :host( [size=l] ) i {
          font-size: 32px;
          height: 32px;
          line-height: 32px;
          max-height: 32px;
          max-width: 32px;
          min-height: 32px;
          min-width: 32px;
          width: 32px;
        }
        
        :host( [size=xl] ) i {
          font-size: 48px;
          height: 48px;
          line-height: 48px;
          max-height: 48px;
          max-width: 48px;
          min-height: 48px;
          min-width: 48px;
          width: 48px;
        }        
      </style>
      <i part="icon"></i>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$icon = this.shadowRoot.querySelector( 'i' ); 
  }

  // When attributes change
  _render() {
    this.$icon.textContent = this.name === null ? '' : this.name;

    if( this.name !== null ) {
      const variation = [];
      variation.push( '\'FILL\' ' + ( this.filled ? 1 : 0 ) );                        
      variation.push( '\'wght\' ' + ( this.weight === null ? 400 : this.weight ) );              
      variation.push( '\'GRAD\' ' + ( this.filled ? 0 : 0 ) );                              
      variation.push( '\'opsz\' ' + ( this.optical === null ? 24 : this.optical ) );                
      this.$icon.style.fontVariationSettings = variation.toString();    
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
    this._upgrade( 'filled' );        
    this._upgrade( 'hidden' );    
    this._upgrade( 'name' );    
    this._upgrade( 'optical' );    
    this._upgrade( 'size' );        
    this._upgrade( 'weight' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'filled',
      'hidden',
      'name',
      'optical',
      'size',
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
  get filled() {
    return this.hasAttribute( 'filled' );
  }

  set filled( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'filled' );
      } else {
        this.setAttribute( 'filled', '' );
      }
    } else {
      this.removeAttribute( 'filled' );
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

  get name() {
    if( this.hasAttribute( 'name' ) ) {
      return this.getAttribute( 'name' );
    }

    return null;
  }

  set name( value ) {
    if( value !== null ) {
      this.setAttribute( 'name', value );
    } else {
      this.removeAttribute( 'name' );
    }
  }  

  get optical() {
    if( this.hasAttribute( 'optical' ) ) {
      return parseInt( this.getAttribute( 'optical' ) );
    }

    return null;
  }

  set optical( value ) {
    if( value !== null ) {
      this.setAttribute( 'optical', value );
    } else {
      this.removeAttribute( 'optical' );
    }
  }  

  get size() {
    if( this.hasAttribute( 'size' ) ) {
      return this.getAttribute( 'size' );
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

  get weight() {
    if( this.hasAttribute( 'weight' ) ) {
      return parseInt( this.getAttribute( 'weight' ) );
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

window.customElements.define( 'sa-icon', StogieIcon );
