import StogieButton from "../core/button.js";
import StogieIcon from "../core/icon.js";
import StogieText from "../text.js";

export default class StogieRecommendedItem extends HTMLElement {
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

        div[part=detail] {
          display: grid;
          grid-template-columns: auto 1fr;
          grid-template-rows: 1fr;
          grid-column-gap: 0px;
          grid-row-gap: 0px;
          padding: 0 16px 0 16px;          
        }

        div[part=detail] sa-text {
          --text-color: #8d8d8d;
        }

        div[part=detail] sa-text span:first-of-type {
          font-weight: 600;
        }

        div[part=detail] sa-vbox:last-of-type {
          align-self: center; 
          justify-self: center;          
        }        

        div[part=detail] sa-vbox:last-of-type sa-text::part( text ) {
          text-align: center;
        }        

        div[part=item] {
          background-color: #ffffff;
          border: solid 1px #e0e0e0;          
          border-radius: 4px;
          box-sizing: border-box;      
          display: flex;            
          flex-direction: column;
          width: 100%;  
        }    

        div[part=options] {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
        }

        sa-button {
          min-width: 50%;
        }

        sa-button::part( button ) {
          border-bottom-right-radius: 4px;
          gap: 12px;
          padding: 0 16px 0 16px;          
        }

        sa-button sa-icon {
          --icon-color: #ffffff;
          --icon-cursor: pointer;
        }        

        sa-text[part=description] {
          flex-basis: 0;
          flex-grow: 1;
          padding: 16px;
        }

        sa-text[part=description]::part( text ) {
          text-align: justify;
        }

        sa-text[part=name] {
          padding: 16px;
        }
      </style>
      <div part="item">
        <sa-text part="name" size="l" weight="bold">Padron 1964 Anniversary Series Maduro</sa-text>
        <div part="detail">
          <sa-vbox>
            <sa-text size="s"><span>Body:</span> Medium</sa-text>
            <sa-text size="s"><span>Wrapper:</span> Connecticut Broadleaf</sa-text>
            <sa-text size="s"><span>Size:</span> 6 x 60</sa-text>
            <sa-text size="s"><span>Country:</span> Nicaragua</sa-text>        
          </sa-vbox>
          <sa-vbox>
            <sa-text size="l">$27</sa-text>
            <sa-text size="s" weight="bold">Est. price</sa-text>
          </sa-vbox>
        </div>      
        <sa-text part="description">Considered one of the best cigars in the world, the Padron 1964 Anniversary Series Maduro offers a complex and rich flavor profile. Expect notes of dark chocolate, espresso, and cedar, with a smooth and creamy finish. The maduro wrapper adds a touch of sweetness and depth.</sa-text>
        <div part="options">
          <sa-button part="more">
            <span>Add to favorites</span>
            <sa-icon name="favorite" slot="icon" weight="200">
          </sa-button>
        </div>
      </div>
    `;
    
    // Properties
    this._data = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$description = this.shadowRoot.querySelector( 'sa-text[part=description]' );
    this.$detail = this.shadowRoot.querySelector( 'sa-vbox[part=detail]' );
    this.$favorite = this.shadowRoot.querySelector( 'sa-button' );
    this.$favorite.addEventListener( this._touch, () => {
      this.favorite = !this.favorite;
      this.dispatchEvent( new CustomEvent( 'sa-favorite', {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: {
          favorite: this.favorite
        }
      } ) );
    } );
    this.$heart = this.shadowRoot.querySelector( 'sa-button sa-icon' );
    this.$label = this.shadowRoot.querySelector( 'sa-text' );
  }

  // When attributes change
  _render() {
    this.$heart.filled = this.favorite;

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
    this._upgrade( 'favorite' );   
    this._render();
  }
  
  // Set down
  diconnectedCallback() {;}

  // Watched attributes
  static get observedAttributes() {
    return [
      'favorite'
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
  get data() {
    return this._data;
  }
  
  set data( value ) {
    this._data = value === null ? null : structuredClone( value );
    this._render();
  }

  // Attributes
  // Reflected
  // Boolean, Number, String, null  
  get favorite() {
    return this.hasAttribute( 'favorite' );
  }

  set favorite( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'favorite' );
      } else {
        this.setAttribute( 'favorite', '' );
      }
    } else {
      this.removeAttribute( 'favorite' );
    }
  }
}

window.customElements.define( 'sa-recommended-item', StogieRecommendedItem );
