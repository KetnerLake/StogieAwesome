export default class StogieSearchField extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: inline-block;
        }

        :host( [hidden] ) {
          display: none;
        }

        button {
          align-items: center;
          cursor: pointer;
          border: none;
          background: none;
          display: flex;
          height: 39px;
          justify-content: center;
          margin: 0;
          padding: 0;
          width: 40px;
          --icon-cursor: pointer;
        } 

        input {
          background: none;
          border: none;
          border-radius: 0;
          box-sizing: border-box;
          color: #161616;
          flex-basis: 0;
          flex-grow: 1;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 16px;
          height: 39px;
          margin: 0;
          min-width: 0;
          outline: none;
          padding: 0;
          text-rendering: optimizeLegibility;
          width: 100%;
          -webkit-tap-highlight-color: transparent;                
        }

        input::placeholder {
          color: #8d8d8d;
          opacity: 1.0;
        }        

        label {
          align-items: center;
          background-color: #ffffff;
          border-bottom: solid 1px #8d8d8d;
          display: flex;
          flex-direction: row;
          margin: 0;
          outline-color: #00000000;
          outline-offset: -2px;
          outline-style: solid;
          outline-width: 2px;            
          padding: 0;
          -webkit-tap-highlight-color: transparent;                          
        }

        label:focus-within {
          outline-color: #0f62fe;
        }

        label input:placeholder-shown ~ button[part=clear] {
          display: none;
        }

        sa-icon {
          padding: 0 10px 0 10px;
          --icon-color: #8d8d8d;
        }

        button sa-icon {
          --icon-color: #161616;
        }

        :host( :not( [clearable] ) ) button[part=clear] {
          display: none;
        }
      </style>
      <label>
        <sa-icon name="search"></sa-icon>
        <slot name="prefix"></slot>
        <input type="search" inputmode="search">
        <button part="clear" type="button">
          <sa-icon name="close" size="s" weight="200"></sa-icon>
        </button>
      </label>
    `;

    // Private
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';    

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$clear = this.shadowRoot.querySelector( 'button[part=clear]' );
    this.$clear.addEventListener( this._touch, () => {
      this.clear();
      this.dispatchEvent( new CustomEvent( 'sa-change', {
        detail: {
          value: this.value
        }
      } ) );
    } );

    this.$input = this.shadowRoot.querySelector( 'input' );
    this.$input.addEventListener( 'input', ( evt ) => {
      this.value = this.$input.value.trim().length === 0 ? null : this.$input.value;
      this.dispatchEvent( new CustomEvent( 'sa-change', {
        detail: {
          value: this.value
        }
      } ) );
    } );    
  }

  blur() {
    this.$input.blur();
  }

  clear( focus = true ) {
    this.value = null;

    if( focus ) {
      this.focus();
    }
  }

  focus() {
    this.$input.focus();
  }

  // When attributes change
  _render() {
    this.$input.placeholder = this.placeholder === null ? '' : this.placeholder;
    this.$input.value = this.value === null ? '' : this.value;
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
    this._upgrade( 'clearable' );      
    this._upgrade( 'hidden' );  
    this._upgrade( 'placeholder' );   
    this._upgrade( 'value' );          
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'clearable',
      'hidden',
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
  // Boolean, Number, String, null
  get clearable() {
    return this.hasAttribute( 'clearable' );
  }

  set clearable( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'clearable' );
      } else {
        this.setAttribute( 'clearable', '' );
      }
    } else {
      this.removeAttribute( 'clearable' );
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
