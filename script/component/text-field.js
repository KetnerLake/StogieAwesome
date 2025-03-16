export default class StogieTextField extends HTMLElement {
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
          padding: 0 6px 0 16px;
        }

        label:focus-within {
          outline-color: #0f62fe;
        }

        label input:placeholder-shown ~ button[part=clear] {
          display: none;
        }

        sa-label {
          padding: 0 0 6px 0;          
          --label-color: #8d8d8d;
        }

        :host( :empty ) label {        
          padding: 0 0 0 16px;
        }

        :host( :not( [label] ) ) sa-part[part=label] {
          display: none;
        }
      </style>
      <sa-label part="label" size="s"></sa-label>
      <label>
        <slot name="prefix"></slot>
        <input type="text">
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
    this.$input.addEventListener( 'input', () => {
      this.value = this.$input.value.trim().length === 0 ? null : this.$input.value;
      this.dispatchEvent( new CustomEvent( 'sa-change', {
        detail: {
          value: this.value
        }
      } ) );
    } );    

    this.$label = this.shadowRoot.querySelector( 'sa-label[part=label]' );    
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

  /*
  doItemClick( evt ) {
    if( evt.detail.checked ) {
      this._selected.push( evt.detail.value );
      this._selected.sort( ( a, b ) => {
        if( a > b ) return 1;
        if( a < b ) return -1;
        return 0;
      } );
    } else {
      const index = this._selected.findIndex( ( value ) => value === evt.detail.value ? true : false );      
      this._selected.splice( index, 1 );
    }

    this.count = this._selected.length === 0 ? null : this._selected.length;
    this.dispatchEvent( new CustomEvent( 'sa-select', {
      detail: {
        count: this.count,
        selected: this._selected
      }
    } ) );
  }
  */

  // When attributes change
  _render() {
    this.$input.placeholder = this.placeholder === null ? '' : this.placeholder;
    this.$input.value = this.value === null ? '' : this.value;
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

  // Setup
  connectedCallback() {
    this._upgrade( 'hidden' );  
    this._upgrade( 'label' );           
    this._upgrade( 'placeholder' );   
    this._upgrade( 'value' );          
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'hidden',
      'label',
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

window.customElements.define( 'sa-text-field', StogieTextField );
