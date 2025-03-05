import StogieButton from "../core/button.js";
import StogieText from "../text.js";

export default class StogieCatalogItem extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-block;
          position: relative;
          width: 100%;
        }

        button {
          align-items: center;
          background: none;
          border: none;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          height: 40px;
          justify-content: center;
          margin: 0 4px 0 0;
          padding: 0;
          width: 40px;
        }

        div {
          align-items: center;
          box-sizing: border-box;      
          display: flex;            
          flex-direction: row;
          padding: 0 0 0 16px;
          width: 100%;  
        }    

        sa-icon {
          --icon-color: #8d8d8d;
          --icon-cursor: pointer;
        }

        sa-text {
          flex-basis: 0;
          flex-grow: 1;
        }
      </style>
      <div>
        <sa-text weight="bold" truncate></sa-text>
        <button type="button">
          <sa-icon name="close" size="s" weight="200"></sa-icon>
        </button>
      </div>
    `;
    
    // Properties
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = this.shadowRoot.querySelector( 'sa-text' );
  }

  // When attributes change
  _render() {
    if( this._data === null ) return;

    this.$label.textContent = this._data.name;    
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
    this._upgrade( 'data' );              
    this._render();
  }
  
  // Set down
  diconnectedCallback() {;}

  // Watched attributes
  static get observedAttributes() {
    return [];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  } 
  
  // Properties
  // Not reflected
  // Array, Date, Object, null
  get data() {
    return this._data;
  }
  
  set data( value ) {
    this._data = value === null ? null : structuredClone( value );
    this._render();
  }
}

window.customElements.define( 'sa-catalog-item', StogieCatalogItem );
