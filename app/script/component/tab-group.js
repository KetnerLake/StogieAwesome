export default class StogieTabGroup extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          background-color: #161616;
          border-top: solid 1px #393939;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          justify-content: center;
          position: relative;
        } 
      </style>
      <slot></slot>
    `;

    // Properties
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    // Events
    this.doTabClick = this.doTabClick.bind( this );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$slot = this.shadowRoot.querySelector( 'slot' );
    this.$slot.addEventListener( 'slotchange', () => {
      for( let c = 0; c < this.children.length; c++ ) {
        this.children[c].setAttribute( 'data-index', c );
        this.children[c].removeEventListener( this._touch, this.doTabClick );
        this.children[c].addEventListener( this._touch, this.doTabClick );
      }     
    } );
  }

  // Tab selection change
  doTabClick( evt ) {
    const index = parseInt( evt.currentTarget.getAttribute( 'data-index' ) );

    if( index === this.selectedIndex )
      return;

    this.dispatchEvent( new CustomEvent( 'sa-change', {
      detail: {
        previousIndex: this.selectedIndex,
        selectedIndex: index
      }
    } ) );

    this.selectedIndex = index;
  }

  // When things change
  _render() {
    const index = this.selectedIndex === null ? 0 : this.selectedIndex;
    for( let c = 0; c < this.children.length; c++ ) {
      this.children[c].selected = c === index ? true : false;
    }    
  }

  // Properties set before module loaded
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  // Default render
  // No attributes set
  connectedCallback() {
    this._upgrade( 'hidden' );
    this._upgrade( 'selectedIndex' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'hidden',
      'selected-index'
    ];
  }

  // Observed tag attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Reflect attributes
  // Return typed value (Number, Boolean, String, null)
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

  get selectedIndex() {
    if( this.hasAttribute( 'selected-index' ) ) {
      return parseInt( this.getAttribute( 'selected-index' ) );
    }

    return null;
  }

  set selectedIndex( value ) {
    if( value !== null ) {
      this.setAttribute( 'selected-index', value );
    } else {
      this.removeAttribute( 'selected-index' );
    }
  }
}

window.customElements.define( 'sa-tab-group', StogieTabGroup );
