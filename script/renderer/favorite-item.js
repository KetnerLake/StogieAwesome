export default class StogieFavoriteItem extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          position: relative;
        }

        button {
          align-items: center;
          background: none;
          border: none;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          height: 39px;
          justify-content: center;
          margin: 0;
          padding: 0;
          width: 40px;
        }

        sa-box {
          width: 100%;
        }

        sa-label {
          flex-basis: 0;
          flex-grow: 1;
          padding: 0 0 0 16px;
        }    

        sa-icon {
          --icon-color: #161616;
          --icon-cursor: pointer;
        }
      </style>
      <sa-box centered>
        <sa-label></sa-label>
        <button type="button">
          <sa-icon name="close" size="s" weight="200"></sa-icon>
        </button>
      </sa-box>
    `;
    
    // Properties
    this._data = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';    

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = this.shadowRoot.querySelector( 'sa-label' );
    this.$remove = this.shadowRoot.querySelector( 'button' );
    this.$remove.addEventListener( this._touch, () => {
      this._data.checked = false;
      this.dispatchEvent( new CustomEvent( 'sa-change', {
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
    this.$label.textContent = this._data === null ? '' : this._data.name;
  }
}

window.customElements.define( 'sa-favorite-item', StogieFavoriteItem );
