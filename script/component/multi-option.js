import StogieIcon from "./icon.js";
import StogieLabel from "./label.js";

export default class StogieMultiOption extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: block;
          position: relative;
        }

        button {
          align-items: center;
          background: none;
          border: none;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          gap: 8px;
          height: 40px;
          margin: 0;
          padding: 0 16px 0 16px;
          width: 100%;
        }

        button:hover {
          background-color: #e8e8e8;
        }

        sa-icon {
          --icon-cursor: pointer;
        }

        sa-label {
          --label-cursor: pointer;
        }
      </style>
      <button part="button" type="button">
        <sa-icon></sa-icon>
        <sa-label truncate></sa-label>
      </button>
    `;
    
    // Properties
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'mousedown';

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$button.addEventListener( this._touch, ( evt ) => {
      evt.preventDefault();
      evt.stopPropagation();

      this.checked = !this.checked;

      this.dispatchEvent( new CustomEvent( 'sa-change', {
        detail: {
          checked: this.checked,
          value: this.value
        }
      } ) );
    } );
    this.$icon = this.shadowRoot.querySelector( 'sa-icon' );
    this.$label = this.shadowRoot.querySelector( 'sa-label' );
  }

  // When attributes change
  _render() {
    this.$icon.name = this.checked ? 'check_box' : 'check_box_outline_blank';
    this.$icon.filled = this.checked ? true : false;
    this.$icon.weight = this.checked ? 400 : 200;
    this.$label.text = this.value;    
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
    this._upgrade( 'checked' );              
    this._upgrade( 'value' );                      
    this._render();
  }
  
  // Set down
  diconnectedCallback() {;}

  // Watched attributes
  static get observedAttributes() {
    return [
      'checked',
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
  get checked() {
    return this.hasAttribute( 'checked' );
  }

  set checked( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'checked' );
      } else {
        this.setAttribute( 'checked', '' );
      }
    } else {
      this.removeAttribute( 'checked' );
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

window.customElements.define( 'sa-multi-option', StogieMultiOption );
