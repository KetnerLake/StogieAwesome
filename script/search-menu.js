import StogieSearchItem from "./search-item.js";

export default class StogieSearchMenu extends HTMLElement {
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

        :host( :not( [open] ) ) {
          display: none;
        }

        div {
          background-color: #ffffff;
          box-shadow: 0 -2px 6px rgba( 0, 0, 0, 0.30 );
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        sa-search-item {
          border-bottom: solid 1px #e0e0e0;
        }

        sa-search-item:last-of-type {
          border-bottom: solid 1px transparent;
        }
      </style>
      <div></div>
    `;
    
    // Properties
    this._items = [];
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$list = this.shadowRoot.querySelector( 'div' );
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

  // Set up
  connectedCallback() {
    this._upgrade( 'items' );      
    this._upgrade( 'open' );          
    this._render();
  }
  
  // Set down
  diconnectedCallback() {;}

  // Watched attributes
  static get observedAttributes() {
    return [
      'open'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  } 
  
  // Properties
  // Not reflected
  // Array, Date, Object, null
  get items() {
    return this._items.length === 0 ? null : this._items;
  }
  
  set items( value ) {
    this._items = value === null ? [] : [... value];

    while( this.$list.children.length > this._items.length ) {
      this.$list.children[0].remove();
    }

    while( this.$list.children.length < this._items.length ) {
      const item = document.createElement( 'sa-search-item' );
      this.$list.appendChild( item );
    }

    for( let c = 0; c < this.$list.children.length; c++ ) {
      this.$list.children[c].data = this._items[c];
    }
  }
  
  // Attributes
  // Reflected
  // Boolean, Float, Integer, String, null
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
}

window.customElements.define( 'sa-search-menu', StogieSearchMenu );
