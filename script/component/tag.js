export default class StogieTag extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          background-color: var( --tag-background-color, #393939 );
          border-radius: var( --tag-size, 24px );
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          position: relative;
        }

        :host( [hidden] ) {
          display: none;
        }

        button {
          align-items: center;
          background: none;
          border: none;
          border-radius: var( --tag-size, 24px );
          cursor: pointer;
          display: flex;
          height: var( --tag-size, 24px );
          justify-content: center;
          margin: 0;
          padding: 0;
          width: var( --tag-size, 24px );
          --icon-cursor: pointer;
          --icon-color: var( --tag-color, #ffffff );
        }

        sa-label {
          padding: 0 2px 0 8px;
          --label-color: var( --tag-color, #ffffff );
        }
      </style>
      <slot name="prefix"></slot>
      <sa-label size="s">
        <slot></slot>
      </sa-label>
      <button type="button">
        <sa-icon name="close" size="s" weight="200"></sa-icon>
      </button>
    `;

    // Properties
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';        

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements 
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$button.addEventListener( this._touch, () => {
      this.dispatchEvent( new CustomEvent( 'sa-remove' ) );
    } );
  }

  // When attributes change
  _render() {;}

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
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'hidden'
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
}

window.customElements.define( 'sa-tag', StogieTag );
