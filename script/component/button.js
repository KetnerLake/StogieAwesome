export default class StogieButton extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        @keyframes loading {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: 143.759616;
          }
        }

        @keyframes spinning {
          from {
            rotate: 0;
          }
          to {
            rotate: 360deg;
          }
        }        

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
          cursor: pointer;
          display: flex;
          flex-direction: row;
          height: 48px;
          margin: 0;
          outline: solid 1px transparent;
          outline-offset: -3px;
          padding: 0 16px 0 16px;
          width: 100%;
          -webkit-tap-highlight-color: transparent;      
          --icon-color: #ffffff;
          --icon-cursor: pointer;
          --label-color: #ffffff;
          --label-cursor: pointer;
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
          cursor: not-allowed;
          --icon-color: #8d8d8d;
          --icon-cursor: not-allowed;
          --label-color: #8d8d8d;
          --label-cursor: not-allowed;
        }

        sa-label {
          flex-basis: 0;
          flex-grow: 1;
        }

        svg {
          animation-duration: 1s;
          animation-fill-mode: forwards;
          animation-iteration-count: infinite;                    
          animation-name: spinning;
          animation-timing-function: linear;          
          height: 16px;
          stroke: #ffffff;          
          fill: rgba( 0, 0, 0, 0 );          
          width: 16px;          
        }

        svg circle {
          animation-direction: alternate;
          animation-duration: 1s;
          animation-fill-mode: forwards;
          animation-iteration-count: infinite;          
          animation-name: loading;
          animation-timing-function: linear;          
          stroke-dasharray: 276.4608;          
          stroke-linecap: butt;          
          stroke-width: 16px;
          transform-origin: center;
        }

        :host( :not( [loading] ) ) svg {
          display: none;
        }

        :host( [disabled] ) svg {
          stroke: #8d8d8d;                              
        }

        :host( [kind=ghost] ) button {
          background-color: transparent;
          box-shadow: none;
          border: solid 1px transparent;
          gap: 4px;
          outline: none;
          padding: 0 4px 0 4px;
          --icon-color: #0f62fe;
          --icon-cursor: pointer;
          --label-color: #0f62fe;
          --label-cursor: pointer;
        }
        :host( [kind=ghost] ) button:active,
        :host( [kind=ghost] ) button:focus,        
        :host( [kind=ghost] ) button:hover {
          border: solid 1px transparent;
          --icon-color: #0f62fe;
          --label-color: #0f62fe;          
        }        
        :host( [disabled][kind=ghost] ) button {
          cursor: not-allowed;
          --icon-color: #8d8d8d;
          --icon-cursor: not-allowed;
          --label-color: #8d8d8d;
          --label-cursor: not-allowed;
        }

        :host( [kind=secondary] ) button {
          background-color: #393939;
          border: solid 1px transparent;
          --icon-color: #ffffff;
          --label-color: #ffffff;                    
        }
        :host( [kind=secondary] ) button:focus {
          background-color: #393939;
          border-color: #0f62fe;
          outline-color: #ffffff;
        }
        :host( [kind=secondary] ) button:hover {
          background-color: #474747;
        }
        
        :host( [kind=tertiary] ) button {
          background-color: transparent;
          border: solid 1px #0f62fe;
          --icon-color: #0f62fe;
          --label-color: #0f62fe;                    
        }
        :host( [kind=tertiary] ) button:focus {
          background-color: #0f62fe;
          border-color: #0f62fe;
          outline-color: #ffffff;
          --icon-color: #ffffff;
          --label-color: #ffffff;          
        }
        :host( [kind=tertiary] ) button:hover {
          background-color: #0050e6;
          border: solid 1px #0050e6;
          --icon-color: #ffffff;
          --label-color: #ffffff;
        }        

        :host( [size=s] ) button {
          height: 32px;
        }        
        :host( [size=m] ) button {
          height: 40px;
        }

        :host( :not( [label] ) ) button {
          align-items: center;
          justify-content: center;
          min-width: 40px;
        }

        :host( :not( [label] ) ) sa-label {
          display: none;
        }
      </style>
      <button part="button" type="button">
        <slot name="prefix"></slot>
        <sa-label part="label"></sa-label>
        <slot></slot>
        <svg viewBox="0 0 100 100">
          <circle cx="50%" cy="50%" r="42"></circle>        
        </svg>
      </button>
    `;
    
    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$label = this.shadowRoot.querySelector( 'sa-label' );    
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
    this._upgrade( 'loading' );                    
    this._upgrade( 'size' );                  
    this._render();
  }
  
  // Watched attributes
  static get observedAttributes() {
    return [
      'disabled',
      'hidden',
      'kind',
      'label',
      'loading',
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

  get loading() {
    return this.hasAttribute( 'loading' );
  }

  set loading( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'loading' );
      } else {
        this.setAttribute( 'loading', '' );
      }
    } else {
      this.removeAttribute( 'loading' );
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
