import StogieIcon from "./icon.js";
import StogieMultiOption from "./multi-option.js";

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

        :host( [concealed] ) {
          visibility: hidden;
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
          width: 39px;
          --icon-cursor: pointer;
        }

        button[part=remove] {
          border-radius: 24px;
          color: #ffffff;
          display: flex;
          height: 24px;
          width: 24px;
          --icon-color: #ffffff;
          --icon-cursor: pointer;
        }

        button[part=clear],
        button[part=toggle] {
          width: 40px;
        }

        button[part=toggle] {
          margin-right: 4px;
        }

        button[part=toggle] i {
          font-size: 20px;  
          height: 20px;    
          line-height: 20px; 
          max-height: 20px;         
          max-width: 20px;                    
          min-height: 20px;                               
          min-width: 20px;      
          transition: rotate 0.60s;
          width: 20px;       
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

        p {
          box-sizing: border-box;
          color: #8d8d8d;
          cursor: default;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 18px;
          margin: 0;
          padding: 0 0 6px 0;
          text-rendering: optimizeLegibility;          
        }

        p[part=count] {
          align-items: center;
          background-color: #393939;
          border-radius: 24px;
          color: #ffffff;
          display: flex;
          flex-direction: row;
          font-size: 14px;
          line-height: 14px;
          height: 24px;
          margin: 0 8px 0 8px;
          padding: 0 0 0 8px;
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
          margin: 0;
          padding: 0;
        }

        ul li:last-of-type {
          border-bottom: solid 1px transparent;
        }

        :host( :not( [count] ) ) p[part=count] {
          display: none;
        }
        :host( :not( [count] ) ) label {        
          padding: 0 0 0 16px;
        }

        :host( :not( [label] ) ) p[part=label] {
          display: none;
        }

        :host( [open] ) button[part=toggle] {
          rotate: 180deg;
        }

        :host( :not( [open] ) ) ul {
          display: none;
        }
      </style>
      <p part="label"></p>
      <label>
        <p part="count">
          <span></span>
          <button part="remove" type="button">
            <sa-icon name="close" size="s" weight="200"></sa-icon>
          </button>
        </p>
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
    this.$count = this.shadowRoot.querySelector( 'p[part=count] span' );
    this.$clear = this.shadowRoot.querySelector( 'button[part=clear]' );
    this.$clear.addEventListener( this._touch, () => this.clear() );
    this.$input = this.shadowRoot.querySelector( 'input' );
    this.$input.addEventListener( 'input', () => {
      this.value = this.$input.value.trim().length === 0 ? null : this.$input.value;

      if( this.value === null ) {
        this.open = false;
        return;
      }

      const matches = this._items.filter( ( value ) => {
        const label = this.labelField === null ? 'label' : this.labelField;
        return value[label].toLowerCase().indexOf( this.value.toLowerCase() ) >= 0 ? true : false;
      } ).slice( 0, 5 );

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
        const checked = this.checkedField === null ? matches[c].checked : matches[c][this.checkedField];
        const label = this.labelField === null ? matches[c].label : matches[c][this.labelField];
        const value = this.valueField === null ? matches[c].value : matches[c][this.valueField];

        this.$menu.children[c].children[0].checked = checked === undefined ? false : checked;
        this.$menu.children[c].children[0].label = label === undefined ? null : label;
        this.$menu.children[c].children[0].value = value === undefined ? null : value;
      }
      
      this.open = matches.length > 0 ? true : false;
    } );    
    this.$label = this.shadowRoot.querySelector( 'p[part=label]' );    
    this.$menu = this.shadowRoot.querySelector( 'ul' );
    this.$remove = this.shadowRoot.querySelector( 'p[part=count] button' );
    this.$remove.addEventListener( this._touch, () => {
      this.count = null;      
      this._selected = [];

      for( let i = 0; i < this._items.length; i++ ) {
        this._items.checked = false;
      }

      const field = this.labelField === null ? 'label' : this.labelField;
      const matches = this._items.filter( ( value ) => {
        return value[field].toLowerCase().indexOf( this.value.toLowerCase() ) >= 0 ? true : false;
      } ).slice( 0, 5 );

      for( let c = 0; c < this.$menu.children.length; c++ ) {
        this.$menu.children[c].children[0].data = matches[c];
      }

      this.$input.focus();

      this.dispatchEvent( new CustomEvent( 'sa-change', {
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

  doItemChange( evt ) {
    const field = this.labelField === null ? 'label' : this.labelField;
    const index = this._items.findIndex( ( value ) => value[field] === evt.detail.label );
    this._items[index].checked = evt.detail.checked;

    this._selected = this._items.filter( ( value ) => value.checked ? true : false );
    this._selected.sort( ( a, b ) => {
      if( a[field] > b[field] ) return 1;
      if( a[field] < b[field] ) return -1;
      return 0;
    } );

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
    this.$count.textContent = this.count === null ? '' : this.count;
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
    this._upgrade( 'checkedField' );  
    this._upgrade( 'concealed' );  
    this._upgrade( 'count' );  
    this._upgrade( 'hidden' );  
    this._upgrade( 'items' );          
    this._upgrade( 'label' );           
    this._upgrade( 'labelField' );           
    this._upgrade( 'open' );          
    this._upgrade( 'placeholder' );          
    this._upgrade( 'value' );          
    this._upgrade( 'valueField' );              
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'checked-field',
      'concealed',
      'count',
      'hidden',
      'label',
      'label-field',
      'open',
      'placeholder',
      'value',
      'value-field'
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

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get checkedField() {
    if( this.hasAttribute( 'checked-field' ) ) {
      return this.getAttribute( 'checked-field' );
    }

    return null;
  }

  set checkedField( value ) {
    if( value !== null ) {
      this.setAttribute( 'checked-field', value );
    } else {
      this.removeAttribute( 'checked-field' );
    }
  }

  get concealed() {
    return this.hasAttribute( 'concealed' );
  }

  set concealed( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'concealed' );
      } else {
        this.setAttribute( 'concealed', '' );
      }
    } else {
      this.removeAttribute( 'concealed' );
    }
  }   

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

  get labelField() {
    if( this.hasAttribute( 'label-field' ) ) {
      return this.getAttribute( 'label-field' );
    }

    return null;
  }

  set labelField( value ) {
    if( value !== null ) {
      this.setAttribute( 'label-field', value );
    } else {
      this.removeAttribute( 'label-field' );
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

  get valueField() {
    if( this.hasAttribute( 'value-field' ) ) {
      return this.getAttribute( 'value-field' );
    }

    return null;
  }

  set valueField( value ) {
    if( value !== null ) {
      this.setAttribute( 'value-field', value );
    } else {
      this.removeAttribute( 'value-field' );
    }
  }      
}

window.customElements.define( 'sa-multi-select', StogieMultiSelect );
