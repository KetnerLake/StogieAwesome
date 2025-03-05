import StogieIcon from "./icon.js";
import StogieText from "./text.js";

export default class StogieSearchField extends HTMLElement {
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

        button {
          align-items: center;
          background: none;
          border: none;
          box-sizing: border-box;
          color: #161616;
          cursor: pointer;
          display: inline-flex;
          height: 39px;
          justify-content: center;
          margin: 0;
          outline: none;
          padding: 0;
          width: 39px;
          -webkit-tap-highlight-color: transparent; 
        }

        button sa-icon {
          --icon-color: #8d8d8d;
          --icon-cursor: pointer;
        }

        input {
          background: none;
          border: none;
          box-sizing: border-box;
          color: #161616;
          flex-basis: 0;
          flex-grow: 1;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 16px;
          font-weight: 400;
          height: 39px;
          margin: 0;
          min-width: 0;
          outline: none;
          padding: 0 12px 0 8px;
          text-rendering: optimizeLegibility;
          width: 100%;
          -webkit-tap-highlight-color: transparent; 
        }

        input::placeholder {
          color: #16161666;          
        }

        label {
          align-items: center;
          background-color: #ffffff;
          background-image: linear-gradient( 0deg, rgba( 69, 137, 255, 0.16 ) 0%, 15%, rgba( 255, 255, 255, 0 ) 50%, transparent 100% );            
          border-bottom: solid 1px #4589ff;          
          box-sizing: border-box;
          cursor: text;
          display: flex;
          flex-direction: row;
          outline-color: #00000000;
          outline-offset: -2px;
          outline-style: solid;
          outline-width: 2px;  
          padding: 0 4px 0 16px;
        }

        label:focus-within {
          outline-color: #0f62fe;
        }

        label > sa-icon:first-of-type {
          --icon-color: #8d8d8d;
        }

        span {
          align-items: center;
          background: none;
          border: none;
          border: solid 1px #8d8d8d;
          box-sizing: border-box;
          color: #8d8d8d;
          display: inline-flex;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 9px;
          font-weight: 400;
          height: 16px;
          justify-content: center;
          line-height: 9px;
          margin: 0 12px 0 0;
          padding: 0;      
          width: 16px;    
        }

        sa-text {
          margin: 0 0 6px;
          --text-color: #8d8d8d;
        }

        :host( :not( [value] ) ) button {
          display: none;
        }
      </style>
      <sa-text size="s"></sa-text>
      <label>
        <sa-icon name="search" weight="200"></sa-icon>
        <input autocomplete="false" autocorrect="false" spellcheck="false" type="text">
        <button type="button">
          <sa-icon name="close" size="s" weight="200"></sa-icon>
        </button>
        <span>AI</span>
      </label>
    `;
    
    // Properties
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$button.addEventListener( this._touch, () => {
      this.open = false;
      this.value = null;
      this.$input.focus();
      this.dispatchEvent( new CustomEvent( 'sa-change', {
        detail: {
          value: null
        }
      } ) );
    } );
    this.$input = this.shadowRoot.querySelector( 'input' );
    this.$input.addEventListener( 'input', () => {
      this.value = this.$input.value.trim().length === 0 ? null : this.$input.value;
      this.dispatchEvent( new CustomEvent( 'sa-change', {
        detail: {
          value: this.value
        }
      } ) );
    } );
    this.$label = this.shadowRoot.querySelector( 'sa-text' );
  }

  clear() {
    this.open = false;
    this.value = null;
  }

  focus() {
    this.$input.focus();
  }

  // When attributes change
  _render() {
    this.$label.textContent = this.label === null ? '' : this.label;
    this.$input.placeholder = this.placeholder === null ? '' : this.placeholder;
    this.$input.value = this.value;
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
    this._upgrade( 'label' );          
    this._upgrade( 'open' );              
    this._upgrade( 'placeholder' );          
    this._upgrade( 'value' );              
    this._render();
  }
  
  // Set down
  diconnectedCallback() {;}

  // Watched attributes
  static get observedAttributes() {
    return [
      'label',      
      'open',
      'placeholder',
      'value'
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

  get open() {
    return this.hasAttribute( 'open' );
  }

  set open( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'open' );
      } else {
        this.setAttribute( 'open', '' );
      }
    } else {
      this.removeAttribute( 'open' );
    }
  }  

  get placeholder() {
    if( this.hasAttribute( 'placeholder' ) ) {
      return this.getAttribute( 'placeholder' );
    }

    return null;
  }

  set placeholder( value ) {
    if( value !== null ) {
      this.setAttribute( 'placeholder', value );
    } else {
      this.removeAttribute( 'placeholder' );
    }
  }
  
  get value() {
    if( this.hasAttribute( 'value' ) ) {
      return this.getAttribute( 'value' );
    }

    return null;
  }

  set value( value ) {
    if( value !== null ) {
      this.setAttribute( 'value', value );
    } else {
      this.removeAttribute( 'value' );
    }
  }  
}

window.customElements.define( 'sa-search-field', StogieSearchField );
