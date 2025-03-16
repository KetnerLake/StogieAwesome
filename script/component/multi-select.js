export default class StogieMultiSelect extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: inline-block;
        }

        :host( [hidden] ) {
          display: none;
        }

        button {
          align-items: center;
          cursor: pointer;
          border: none;
          background: none;
          display: flex;
          height: 39px;
          justify-content: center;
          margin: 0;
          padding: 0;
          width: 40px;
          --icon-cursor: pointer;
        } 

        button[part=toggle] {
          margin-right: 4px;
        }

        div {
          background-color: #e0e0e0;
          height: 16px;
          width: 1px;
        }

        input {
          background: none;
          border: none;
          box-sizing: border-box;
          color: #161616;
          flex-basis: 0;
          flex-grow: 1;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 16px;
          height: 39px;
          margin: 0;
          min-width: 0;
          outline: none;
          padding: 0;
          text-rendering: optimizeLegibility;
        }

        input::placeholder {
          color: #8d8d8d;
          opacity: 1.0;
        }        

        label {
          align-items: center;
          background-color: #ffffff;
          border-bottom: solid 1px #8d8d8d;
          display: flex;
          flex-direction: row;
          margin: 0;
          outline-color: #00000000;
          outline-offset: -2px;
          outline-style: solid;
          outline-width: 2px;            
          padding: 0 0 0 4px;
        }

        label:focus-within {
          outline-color: #0f62fe;
        }

        label input:placeholder-shown ~ button[part=clear],
        label input:placeholder-shown ~ div {
          display: none;
        }

        sa-label {
          --label-color: #8d8d8d;
          padding: 0 0 6px 0;
        }

        sa-tag {
          margin: 0 8px 0 12px;
        }

        ul {
          background-color: #ffffff;
          bottom: 121px;
          box-shadow: 
            0 -2px 6px rgba( 0, 0, 0, 0.20 ), 
            0 -6px 24px rgba( 0, 0, 0, 0.05 );          
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          left: 16px;
          list-style: none;
          margin: 0;
          padding: 0;
          position: absolute;
          right: 16px;
          z-index: 100;
        }

        ul li {
          box-sizing: border-box;
          border-bottom: solid 1px #e0e0e0;
          cursor: pointer;
          margin: 0;
          padding: 0;
        }

        ul li:last-of-type {
          border-bottom: solid 1px transparent;
        }

        :host( :not( [count] ) ) sa-tag {
          display: none;
        }

        :host( :not( [count] ) ) label {        
          padding: 0 0 0 16px;
        }

        :host( :not( [label] ) ) sa-part[part=label] {
          display: none;
        }

        :host( [open] ) button[part=toggle] {
          rotate: 180deg;
        }

        :host( :not( [open] ) ) ul {
          display: none;
        }
      </style>
      <sa-label part="label" size="s"></sa-label>
      <label>
        <sa-tag></sa-tag>
        <input type="text">
        <button part="clear" type="button">
          <sa-icon name="close" size="s" weight="200"></sa-icon>
        </button>
        <div></div>
        <button part="toggle" type="button">
          <sa-icon name="keyboard_arrow_down" weight="200"></sa-icon>
        </button>
      </label>
      <ul part="menu"></ul>              
    `;

    // Private
    this._items = [];
    this._selected = [];
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';    

    // Events
    this.doItemChange = this.doItemChange.bind( this );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$clear = this.shadowRoot.querySelector( 'button[part=clear]' );
    this.$clear.addEventListener( this._touch, () => this.clear() );
    this.$input = this.shadowRoot.querySelector( 'input' );
    this.$input.addEventListener( 'input', () => {
      this.value = this.$input.value.trim().length === 0 ? null : this.$input.value;

      if( this.value === null ) {
        this.open = false;
        return;
      }

      const matches = this._items.filter( ( value ) => value.toLowerCase().indexOf( this.value.toLowerCase() ) >= 0 ? true : false ).slice( 0, 5 );

      while( this.$menu.children.length > matches.length ) {
        this.$menu.children[0].children[0].removeEventListener( 'sa-change', this.doItemChange );
        this.$menu.children[0].remove();
      }

      while( this.$menu.children.length < matches.length ) {
        const item = document.createElement( 'li' );
        const match = document.createElement( 'sa-multi-option' );
        match.addEventListener( 'sa-change', this.doItemChange );        
        item.appendChild( match );
        this.$menu.appendChild( item );
      }

      for( let c = 0; c < this.$menu.children.length; c++ ) {
        const index = this._selected.findIndex( ( value ) => value === this.$menu.children[c].children[0].value ? true : false );
        this.$menu.children[c].children[0].checked = index >= 0 ? true : false;
        this.$menu.children[c].children[0].value = matches[c];
      }
      
      this.open = matches.length > 0 ? true : false;
    } );    
    this.$label = this.shadowRoot.querySelector( 'sa-label[part=label]' );    
    this.$menu = this.shadowRoot.querySelector( 'ul' );
    this.$tag = this.shadowRoot.querySelector( 'sa-tag' );
    this.$tag.addEventListener( 'sa-remove', () => {
      this.count = null;      
      this._selected = [];

      for( let c = 0; c < this.$menu.children.length; c++ ) {
        this.$menu.children[c].children[0].checked = false;
      }

      this.open = false;
      this.$input.focus();

      this.dispatchEvent( new CustomEvent( 'sa-clear', {
        detail: {
          count: null,
          selected: null
        }
      } ) );
    } );
    this.$toggle = this.shadowRoot.querySelector( 'button[part=toggle]' );
    this.$toggle.addEventListener( this._touch, () => {
      if( this.value !== null ) {
        this.open = !this.open;
      }
    } );
  }

  clear( focus = true ) {
    this.open = false;    
    this.value = null;

    if( focus ) {
      this.$input.focus()
    }
  }

  focus() {
    this.$input.focus();
  }

  doItemChange( evt ) {
    if( evt.detail.checked ) {
      this._selected.push( evt.detail.value );
      this._selected.sort( ( a, b ) => {
        if( a > b ) return 1;
        if( a < b ) return -1;
        return 0;
      } );
    } else {
      const index = this._selected.findIndex( ( value ) => value === evt.detail.value ? true : false );      
      this._selected.splice( index, 1 );
    }

    this.count = this._selected.length === 0 ? null : this._selected.length;
    this.dispatchEvent( new CustomEvent( 'sa-change', {
      detail: {
        count: this.count,
        selected: this._selected
      }
    } ) );
  }

   // When attributes change
  _render() {
    this.$tag.dismissable = this.removeable;
    this.$tag.textContent = this.count === null ? '' : this.count;
    this.$input.placeholder = this.placeholder === null ? '' : this.placeholder;
    this.$input.value = this.value === null ? '' : this.value;
    this.$label.textContent = this.label === null ? '' : this.label;
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
    this._upgrade( 'count' );  
    this._upgrade( 'hidden' );  
    this._upgrade( 'items' );          
    this._upgrade( 'label' );           
    this._upgrade( 'open' );          
    this._upgrade( 'placeholder' );   
    this._upgrade( 'removeable' );      
    this._upgrade( 'selected' );                     
    this._upgrade( 'value' );          
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'count',
      'hidden',
      'label',
      'open',
      'placeholder',
      'removeable',
      'value'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  } 

  // Properties
  // Not reflected
  // Array, Date, Function, Object, null
  get items() {
    return this._items.length === 0 ? null : this._items;
  }

  set items( value ) {
    this._items = value === null ? [] : [... value];
  }
  
  get selected() {
    return this._selected.length === 0 ? null : this._selected;
  }

  set selected( value ) {
    this._selected = value === null ? [] : [... value];

    for( let c = 0; c < this.$menu.children.length; c++ ) {
      const index = this._selected.findIndex( ( value ) => value === this.$menu.children[c].children[0].value ? true : false );
      this.$menu.children[c].children[0].checked = index >= 0 ? true : false;
    }

    this.count = this._selected === null ? null : this._selected.length;
  }  

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get count() {
    if( this.hasAttribute( 'count' ) ) {
      return parseInt( this.getAttribute( 'count' ) );
    }

    return null;
  }

  set count( value ) {
    if( value !== null ) {
      this.setAttribute( 'count', value );
    } else {
      this.removeAttribute( 'count' );
    }
  }

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

  get label() {
    if( this.hasAttribute( 'label' ) ) {
      return this.getAttribute( 'label' );
    }

    return null;
  }

  set label( value ) {
    if( value !== null ) {
      this.setAttribute( 'label', value );
    } else {
      this.removeAttribute( 'label' );
    }
  }

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
  
  get placeholder() {
    if( this.hasAttribute( 'placeholder' ) ) {
      return this.getAttribute( 'placeholder' );
    }

    return null;
  }

  set placeholder( value ) {
    if( value !== null ) {
      this.setAttribute( 'placeholder', value );
    } else {
      this.removeAttribute( 'placeholder' );
    }
  }  

  get removeable() {
    return this.hasAttribute( 'removeable' );
  }

  set removeable( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'removeable' );
      } else {
        this.setAttribute( 'removeable', '' );
      }
    } else {
      this.removeAttribute( 'removeable' );
    }
  }  

  get value() {
    if( this.hasAttribute( 'value' ) ) {
      return this.getAttribute( 'value' );
    }

    return null;
  }

  set value( value ) {
    if( value !== null ) {
      this.setAttribute( 'value', value );
    } else {
      this.removeAttribute( 'value' );
    }
  }    
}

window.customElements.define( 'sa-multi-select', StogieMultiSelect );
