export default class StogieList extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: block;
          overflow: hidden;
          position: relative;
        }

        :host( [hidden] ) {
          display: none;
        }

        div[part=empty] {
          align-items: center;
          display: flex;
          flex-direction: column;
          gap: 16px;
          height: 100%;
          justify-content: center;
        }

        ul {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          margin: 0;
          overflow: auto;
          padding: 0;
          width: 100%;
        }

        ul:empty {
          display: none;
        }

        ul:not( :empty ) ~ div {
          display: none !important;
        }

        li {
          background-color: #ffffff;
          border-bottom: solid 1px #e0e0e0;
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        li:last-of-type {
          border-bottom: solid 1px transparent;
        }

        :host( [carded] ) ul {
          gap: 16px;
        }

        :host( [carded] ) li {
          border: solid 1px #e0e0e0;
          border-radius: 4px;
        }
      </style>
      <ul part="list"></ul>
      <div part="empty">
        <slot name="empty"></slot>
      </div>
    `;

    // Private
    this._items = [];

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$list = this.shadowRoot.querySelector( 'ul' );
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
    this._upgrade( 'carded' );    
    this._upgrade( 'hidden' );    
    this._upgrade( 'items' );        
    this._upgrade( 'itemRenderer' );            
    this._upgrade( 'labelField' );                
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'carded',
      'hidden',
      'item-renderer',
      'label-field'
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
      const item = document.createElement( 'li' );
      const renderer = this.itemRenderer === null ? 'p' : this.itemRenderer;
      const cell = document.createElement( renderer );

      item.appendChild( cell );
      this.$list.appendChild( item );
    }

    for( let c = 0; c < this.$list.children.length; c++ ) {
      if( this.itemRenderer === null ) {
        if( this.labelField === null ) {
          this.$list.children[c].children[0].textContent = this._items[c];
        } else {
          this.$list.children[c].children[0].textContent = this._items[c][this.labelField];
        }
      } else {
        this.$list.children[c].children[0].data = this._items[c];
      }
    }
  }

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get carded() {
    return this.hasAttribute( 'carded' );
  }

  set carded( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'carded' );
      } else {
        this.setAttribute( 'carded', '' );
      }
    } else {
      this.removeAttribute( 'carded' );
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

  get itemRenderer() {
    if( this.hasAttribute( 'item-renderer' ) ) {
      return this.getAttribute( 'item-renderer' );
    }

    return null;
  }

  set itemRenderer( value ) {
    if( value !== null ) {
      this.setAttribute( 'item-renderer', value );
    } else {
      this.removeAttribute( 'item-renderer' );
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
}

window.customElements.define( 'sa-list', StogieList );
