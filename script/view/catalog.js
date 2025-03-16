customElements.define( 'sa-catalog', class extends HTMLElement {
  constructor() {
    super();

    // Elements
    this.$select = this.querySelector( 'sa-multi-select' );
    this.$select.addEventListener( 'sa-change', ( evt ) => {
      this.$list.items = evt.detail.selected;

      this.dispatchEvent( new CustomEvent( 'sa-change', {
        detail: {
          count: evt.detail.selected === null ? null : evt.detail.selected.length
        }
      } ) );
    } );
    this.$select.addEventListener( 'sa-clear', () => {
      this.$list.items = null;
      this.$select.open = false;

      this.dispatchEvent( new CustomEvent( 'sa-change', {
        detail: {
          count: null
        }
      } ) );
    } );

    this.$list = this.querySelector( 'sa-list' );
    this.$list.addEventListener( 'sa-remove', ( evt ) => {
      const favorites = this.$list.items === null ? [] : [... this.$list.items];

      this.$select.open = false;

      if( this.minimum !== null ) {
        if( favorites.length === this.minimum ) {
          this.dispatchEvent( new CustomEvent( 'sa-catalog-minimum', {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: {
              minimum: this.minimum
            }
          } ) );
          // return;
        }
      }

      const index = favorites.findIndex( ( value ) => value === evt.detail.value ? true : false );
      favorites.splice( index, 1 );
      this.$list.items = favorites;

      this.$select.selected = favorites;

      this.dispatchEvent( new CustomEvent( 'sa-change', {
        detail: {
          count: favorites === null ? null : favorites.length
        }
      } ) );      
    } );
  }

  focus() {
    this.$select.focus();
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

  // Setup
  connectedCallback() {
    this._upgrade( 'favorites' );
    this._upgrade( 'items' );
    this._upgrade( 'minimum' );    
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'minimum'
    ];
  }

  // Properties
  // Not reflected
  // Array, Date, Object, null
  get favorites() {
    return this.$list.items;
  }

  set favorites( value ) {
    this.$list.items = value;
    this.$select.selected = value;
  }    

  get items() {
    return this.$select.items;
  }

  set items( value ) {
    this.$select.items = value;
  }  

  // Attributes
  // Reflected
  // Boolean, Float, Integer, String, null
  get minimum() {
    if( this.hasAttribute( 'minimum' ) ) {
      return parseInt( this.getAttribute( 'minimum' ) );
    }

    return null;
  }

  set minimum( value ) {
    if( value !== null ) {
      this.setAttribute( 'minimum', value );
    } else {
      this.removeAttribute( 'minimum' );
    }
  }  
} );
