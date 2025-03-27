export default class StogieCatalogItem extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          height: 39px;
          min-height: 39px;
          overflow: hidden;
          position: relative;
        }

        sa-label {
          flex-basis: 0;
          flex-grow: 1;
          padding: 0 16px 0 0;
          --label-cursor: pointer;
        }    

        sa-icon {
          padding: 0 10px 0 10px;
          --icon-color: #0f62fe;
          --icon-cursor: pointer;
        }
      </style>
      <sa-icon name="circle" weight="200"></sa-icon>
      <sa-label truncate></sa-label>
    `;
    
    // Properties
    this._data = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';    

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$icon = this.shadowRoot.querySelector( 'sa-icon' );
    this.$label = this.shadowRoot.querySelector( 'sa-label' );

    this.addEventListener( this._touch, () => {
      this.dispatchEvent( new CustomEvent( 'sa-favorite', {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: {
          value: this._data
        }
      } ) );
    } );    
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
  }

  // Properties
  // Not reflected
  // Array, Date, Object, null
  get data() {
    return this._data;
  }
  
  set data( value ) {
    this._data = value === null ? null : structuredClone( value );

    if( this._data === null ) return;

    this.$icon.filled = this._data.checked;
    this.$icon.name = this._data.checked ? 'check_circle' : 'circle';
    this.$icon.weight = this._data.checked ? 400 : 200;
    this.$label.textContent = this._data === null ? '' : this._data.name;
  }
}

window.customElements.define( 'sa-catalog-item', StogieCatalogItem );
