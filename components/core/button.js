export default class StogieButton extends HTMLElement {
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
          background-color: #0f62fe;
          border: none;
          box-sizing: border-box;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          flex-direction: var( --button-flex-direction, row );
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 16px;
          font-weight: 400;
          height: 48px;
          line-height: 16px;
          margin: 0;
          outline: solid 1px transparent;
          outline-offset: -3px;
          padding: 0 16px 0 16px;
          text-align: left;
          text-rendering: optimizeLegibility;
          width: 100%;
          -webkit-tap-highlight-color: transparent;      
          --icon-color: #ffffff;     
        }

        button:hover {
          background-color: #0050e6;
        }

        button:focus {
          border-color: #0f62fe;
          box-shadow:
            inset 0 0 0 1px #0f62fe,
            inset 0 0 0 2px #ffffff;
        }

        button:active {
          background-color: #002d9c;
        }        

        button:disabled {
          background-color: #c6c6c6;
          color: #8d8d8d;
          cursor: not-allowed;
          --icon-color: #8d8d8d;
          --icon-cursor: not-allowed;
        }

        span {
          flex-basis: 0;
          flex-grow: 1;
        }

        :host( [kind=ghost] ) button {
          background-color: transparent;
          border: solid 1px transparent;
          gap: 4px;
          padding: 0 4px 0 4px;
          --icon-color: #0f62fe;
          --icon-cursor: pointer;
        }
        :host( [kind=ghost] ) span { 
          color: #0f62fe; 
        }
        :host( [kind=ghost] ) button:active,
        :host( [kind=ghost] ) button:focus,        
        :host( [kind=ghost] ) button:hover {
          background-color: #8d8d8d1f;
          border: solid 1px transparent;
        }        
        :host( [kind=ghost] ) button:active span,
        :host( [kind=ghost] ) button:focus span,
        :host( [kind=ghost] ) button:hover span { 
          color: #0f62fe; 
        }

        :host( [kind=secondary] ) button {
          background-color: #393939;
          border: solid 1px transparent;
        }
        :host( [kind=secondary] ) span { 
          color: #ffffff; 
        }
        :host( [kind=secondary] ) button:focus {
          background-color: #393939;
          border-color: #0f62fe;
          outline-color: #ffffff;
        }
        :host( [kind=secondary] ) button:hover {
          background-color: #474747;
        }                                

        :host( [size=s] ) button {
          height: 32px;
        }        
        :host( [size=m] ) button {
          height: 40px;
        }
      </style>
      <button part="button" type="button">
        <slot name="prefix"></slot>
        <span part="label"></span>
        <slot></slot>
      </button>
    `;
    
    // Properties
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$label = this.shadowRoot.querySelector( 'span' );    
  }

  // When attributes change
  _render() {
    this.$button.disabled = this.disabled;
    this.$label.textContent = this.label === null ? '' : this.label;
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
    this._upgrade( 'kind' );            
    this._upgrade( 'label' );                
    this._upgrade( 'size' );                  
    this._render();
  }
  
  // Set down
  diconnectedCallback() {;}

  // Watched attributes
  static get observedAttributes() {
    return [
      'disabled',
      'hidden',
      'kind',
      'label',
      'size'
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
  
  get kind() {
    if( this.hasAttribute( 'kind' ) ) {
      return this.getAttribute( 'kind' );
    }

    return null;
  }

  set kind( value ) {
    if( value !== null ) {
      this.setAttribute( 'kind', value );
    } else {
      this.removeAttribute( 'kind' );
    }
  }  

  get label() {
    if( this.hasAttribute( 'label' ) ) {
      return this.getAttribute( 'label' );
    }

    return null;
  }

  set label( value ) {
    if( value !== null ) {
      this.setAttribute( 'label', value );
    } else {
      this.removeAttribute( 'label' );
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
}

window.customElements.define( 'sa-button', StogieButton );
