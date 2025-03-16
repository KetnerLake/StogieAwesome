export default class StogieFavoriteItem extends HTMLElement {
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
          height: 47px;
          justify-content: center;
          margin: 0 4px 0 0;
          padding: 0;
          width: 48px;
        }

        sa-box[centered] {
          padding: 0 0 0 16px;
          width: 100%;
        }

        sa-box[direction=column] {
          flex-basis: 0;
          flex-grow: 1;
        }

        sa-label:last-of-type {
          --label-color: #8d8d8d;
        }

        sa-icon {
          --icon-cursor: pointer;
        }
      </style>
      <sa-box centered>
        <sa-box direction="column">
          <sa-label part="name"></sa-label>
          <sa-label part="flavors" size="s">Earthy, fruity, spicy</sa-label>
        </sa-box>
        <button type="button">
          <sa-icon name="chevron_right" size="s" weight="200"></sa-icon>
        </button>        
      </sa-box>
    `;
    
    // Properties
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$flavors = this.shadowRoot.querySelector( 'sa-label[part=flavors]' );
    this.$label = this.shadowRoot.querySelector( 'sa-label[part=name]' );
    this.$remove = this.shadowRoot.querySelector( 'button' );
  }

  // When attributes change
  _render() {
    if( this._data === null ) return;

    this.$label.textContent = this._data.name;    
    this.$flavors.hidden = !this._data.hasOwnProperty( 'flavors' );
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

window.customElements.define( 'sa-favorite-item', StogieFavoriteItem );
