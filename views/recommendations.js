customElements.define( 'sa-recommendations', class extends HTMLElement {
  constructor() {
    super();

    // this.doFieldChange = this.doFieldChange.bind( this );

    this._cigars = [];

    this.$list = this.querySelector( 'sa-list' );
  }

  /*
  doFieldChange( evt ) {
    if( evt.detail.value === null ) {
      this.$menu.open = false;
      return;
    }

    this.$menu.items = this._catalog.filter( ( value ) => {
      return value.name.toLowerCase().indexOf( evt.detail.value.toLowerCase() ) >= 0 ? true : false;
    } ).slice( 0, 5 );      
    this.$menu.open = evt.detail.value === null ? false : true;
  }
  */

  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  connectedCallback() {
    this._upgrade( 'cigars' );
    // this.$field.addEventListener( 'sa-change', this.doFieldChange );
  }

  disconnectedCallback() {
    // this.$field.removeEventListener( 'sa-change', this.doFieldChange );
  }  

  get cigars() {
    return this.$list.items;
  }

  set cigars( value ) {
    this.$list.items = value;
  }  
} );
