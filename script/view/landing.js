customElements.define( 'sa-landing', class extends HTMLElement {
  constructor() {
    super();

    this.doSelectChange = this.doSelectChange.bind( this );
    this.doRecommendClick = this.doRecommendClick.bind( this );

    this._favorites = [];
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    this.$select = this.querySelector( 'sa-multi-select' );
    this.$select.addEventListener( 'sa-change', ( evt ) => {
      this.$list.items = evt.detail.selected === null ? [] : evt.detail.selected;      
      if( evt.detail.count === null ) {
        this.$recommend.disabled = true;
      } else {
        this.$recommend.disabled = evt.detail.count >= 3 ? false : true;
      }
    } );
    this.$list = this.querySelector( 'sa-list' );
    this.$recommend = this.querySelector( 'sa-button' );
    this.$recommend.addEventListener( this._touch, () => {
      this.$select.open = false;
    } )
  }

  /*
  doMenuChange( evt ) {
    const index = this._catalog.findIndex( ( value ) => value.name === evt.detail.name ? true : false );
    this._catalog[index].checked = evt.detail.checked;

    this._favorites = this._catalog.filter( ( value ) => value.checked ? true : false );
    this._favorites.sort( ( a, b ) => {
      if( a.name > b.name ) return 1;
      if( a.name < b.name ) return -1;
      return 0;
    } );
    this.$list.items = this._favorites;

    this.$recommend.disabled = this._favorites.length >= 3 ? false : true;
  }
  */

  doRecommendClick() {
    // this.$menu.open = false;
    this.dispatchEvent( new CustomEvent( 'sa-recommend', {
      detail: {
        cigars: [... this._favorites]
      }
    } ) );
  }  

  doSelectChange( evt ) {
    /*
    if( evt.detail.value === null ) {
      this.$menu.open = false;
      return;
    }

    this.$menu.items = this._catalog.filter( ( value ) => {
      return value.name.toLowerCase().indexOf( evt.detail.value.toLowerCase() ) >= 0 ? true : false;
    } ).slice( 0, 5 );      
    this.$menu.open = evt.detail.value === null ? false : true;
    */
  }  

  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  connectedCallback() {
    this._upgrade( 'catalog' );
    this.$select.addEventListener( 'sa-change', this.doSelectChange );
    // this.$menu.addEventListener( 'sa-change', this.doMenuChange );  
    this.$recommend.addEventListener( this._touch, this.doRecommendClick );  
  }

  disconnectedCallback() {
    this.$select.removeEventListener( 'sa-change', this.doSelectChange );
    // this.$menu.removeEventListener( 'sa-change', this.doMenuChange );    
    this.$recommend.removeEventListener( this._touch, this.doRecommendClick );
  }  

  get catalog() {
    return this.$select.items;
  }

  set catalog( value ) {
    this.$select.items = value === null ? [] : [... value];
  }  

  get favorites() {
    return this._favorites.length === 0 ? null : this._favorites;
  }

  set favorites( value ) {
    this._favorites = value === null ? [] : [... value];
  }    
} );
