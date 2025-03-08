import StogieIcon from "../core/icon.js";

export default class StogieMenuItem extends HTMLElement {
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

        div {
          align-items: center;
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

        div:hover {
          background-color: #e8e8e8;
        }

        p {
          box-sizing: border-box;
          color: #161616;
          cursor: pointer;
          flex-basis: 0;
          flex-grow: 1;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 16px;
          font-weight: 400;
          margin: 0;
          overflow: hidden;
          padding: 0;
          text-overflow: ellipsis;          
          text-rendering: optimizeLegibility;
          white-space: nowrap;
        }        

        sa-icon {
          --icon-cursor: pointer;
        }
      </style>
      <div>
        <sa-icon></sa-icon>
        <p></p>
      </div>
    `;
    
    // Properties
    this._data = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'mousedown';

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'div' );
    this.$button.addEventListener( this._touch, ( evt ) => {
      evt.preventDefault();
      evt.stopPropagation();

      this._data.checked = !this._data.checked;
      this._render();

      this.dispatchEvent( new CustomEvent( 'sa-change', {
        detail: {
          checked: this._data.checked,
          name: this._data.name
        }
      } ) );
    } );
    this.$icon = this.shadowRoot.querySelector( 'sa-icon' );
    this.$label = this.shadowRoot.querySelector( 'p' );
  }

  // When attributes change
  _render() {
    if( this._data === null ) return;

    this.$icon.name = this._data.checked ? 'check_box' : 'check_box_outline_blank';
    this.$icon.filled = this._data.checked ? true : false;
    this.$icon.weight = this._data.checked ? 400 : 200;
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

window.customElements.define( 'sa-menu-item', StogieMenuItem );
