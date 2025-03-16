export default class StogieAlert extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          background-color: #ffffff;
          border-radius: 4px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          min-width: 300px;
          position: relative;
        }

        :host( [hidden] ) {
          display: none;
        }        

        sa-label[part=label] {
          padding: 0 16px 16px 16px;    
        }
        
        sa-label[part=message] {
          padding: 0 16px 32px 16px;    
        }        

        sa-label[part=title] {
          padding: 16px 16px 0 16px;
          --label-color: #8d8d8d;
        }

        sa-box {
          justify-content: flex-end;
        }

        sa-button {
          width: 50%;
        }

        sa-button::part( button ) {
          border-bottom-right-radius: 4px;
        }
      </style>
      <sa-label part="title" size="s">Stogie Awesome</sa-label>
      <sa-label part="label" size="l" weight="bold">Alert</sa-label>
      <sa-label part="message">This is the message.</sa-label>
      <sa-box>
        <sa-button label="Ok"></sa-button>
      </sa-box>
    `;

    // Properties
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';    

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = this.shadowRoot.querySelector( 'sa-label[part=label]' );
    this.$message = this.shadowRoot.querySelector( 'sa-label[part=message]' );
    this.$title = this.shadowRoot.querySelector( 'sa-label[part=title]' );
    this.$ok = this.shadowRoot.querySelector( 'sa-button' );
    this.$ok.addEventListener( this._touch, () => {
      this.dispatchEvent( new CustomEvent( 'sa-dismiss' ) );
    } );
  }

  // When attributes change
  _render() {
    this.$title.textContent = this.title === null ? '' : this.title;    
    this.$label.textContent = this.label === null ? '' : this.label;
    this.$message.textContent = this.message === null ? '' : this.message;
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
    this._upgrade( 'hidden' );  
    this._upgrade( 'label' );  
    this._upgrade( 'message' );  
    this._upgrade( 'title' );           
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'hidden',
      'label',
      'message',
      'title'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  } 

  // Attributes
  // Reflected
  // Boolean, Number, String, null
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

  get message() {
    if( this.hasAttribute( 'message' ) ) {
      return this.getAttribute( 'message' );
    }

    return null;
  }

  set message( value ) {
    if( value !== null ) {
      this.setAttribute( 'message', value );
    } else {
      this.removeAttribute( 'message' );
    }
  }             

  get title() {
    if( this.hasAttribute( 'title' ) ) {
      return this.getAttribute( 'title' );
    }

    return null;
  }

  set title( value ) {
    if( value !== null ) {
      this.setAttribute( 'title', value );
    } else {
      this.removeAttribute( 'title' );
    }
  }               
}

window.customElements.define( 'sa-alert', StogieAlert );
