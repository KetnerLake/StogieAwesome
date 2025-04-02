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
          grid-template-columns: auto 120px;
          grid-template-rows: 1fr;
          grid-column-gap: 0px;
          grid-row-gap: 0px;
          padding: 0 16px 0 16px;          
        }

        div[part=detail] sa-label {
          --label-color: #8d8d8d;
        }

        div[part=detail] sa-label span:first-of-type {
          font-weight: 600;
        }

        sa-button::part( button ) {        
          border-top-right-radius: 4px;
          border-bottom-left-radius: 4px;          
        }

        sa-box[part=options] {
          justify-content: flex-end;
        }        

        sa-label[part=name] {
          flex-basis: 0;
          flex-grow: 1;
          padding: 12px 16px 14px 16px;
        }

        sa-label[part=description] {
          padding: 16px;
          --label-text-align: justify;
        }        
      </style>
      <sa-box direction="column" part="item">
        <sa-box>
          <sa-label part="name" size="l" weight="bold"></sa-label>
          <sa-button>
            <sa-icon name="favorite" weight="200"></sa-icon>
          </sa-button>
        </sa-box>
        <div part="detail">
          <sa-box direction="column">
            <sa-label part="body" size="s"><span>Body:</span> <span></span></sa-label>
            <sa-label part="wrapper" size="s"><span>Wrapper:</span> <span><span></sa-label>
            <sa-label part="size" size="s"><span>Size:</span> <span></span></sa-label>
            <sa-label part="country" size="s"><span>Country:</span> <span></span></sa-label>        
          </sa-box>
          <sa-box centered direction="column" justified>
            <sa-label part="price" size="l"></sa-label>
            <sa-label size="s" weight="bold">Est. price</sa-label>
          </sa-box>
        </div>      
        <sa-label part="description"></sa-label>
      </sa-box>
    `;
    
    // Properties
    this._data = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$body = this.shadowRoot.querySelector( 'sa-label[part=body] span:last-of-type' );
    this.$country = this.shadowRoot.querySelector( 'sa-label[part=country] span:last-of-type' );    
    this.$description = this.shadowRoot.querySelector( 'sa-label[part=description]' );
    this.$favorite = this.shadowRoot.querySelector( 'sa-button' );
    this.$favorite.addEventListener( this._touch, () => {
      this._data.favorite = !this._data.favorite;
      this.$heart.filled = this._data.favorite;

      this.dispatchEvent( new CustomEvent( 'sa-favorite', {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: {
          value: this._data
        }
      } ) );
    } );
    this.$heart = this.shadowRoot.querySelector( 'sa-button sa-icon' );
    this.$label = this.shadowRoot.querySelector( 'sa-label[part=name]' );
    this.$price = this.shadowRoot.querySelector( 'sa-label[part=price]' );        
    this.$size = this.shadowRoot.querySelector( 'sa-label[part=size] span:last-of-type' );    
    this.$wrapper = this.shadowRoot.querySelector( 'sa-label[part=wrapper] span:last-of-type' );
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

    this.$label.textContent = this._data.name;    
    this.$heart.filled = this._data.favorite;    
    this.$body.textContent = this._data.body;
    this.$wrapper.textContent = this._data.wrapper;
    this.$size.textContent = `${this._data.length.toFixed( 2 )} x ${this._data.gauge}`;
    this.$country.textContent = this._data.country;
    this.$description.textContent = this._data.description + '.';
    this.$price.textContent = `$${this._data.price.toFixed( 2 )}`;
  }
}

window.customElements.define( 'sa-recommended-item', StogieRecommendedItem );
