export default class StogieNotification extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          background-color: #393939;
          border-left: solid 3px #42be65;
          bottom: 16px;
          box-shadow: 
            0 0 6px rgba( 0, 0, 0, 0.20 ), 
            0 0 24px rgba( 0, 0, 0, 0.05 );          
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          left: 16px;
          min-width: 300px;
          padding: 16px;
          position: absolute;
          right: 16px;
        }

        :host( [hidden] ) {
          display: none;
        }

        button {
          align-items: center;
          background: none;
          border: none;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          height: 40px;
          justify-content: center;
          margin: -10px -10px 0 0;
          padding: 0;
          min-width: 40px;
        }

        button sa-icon {
          --icon-color: #ffffff;
          --icon-cursor: pointer;
        }

        sa-box {
          margin-left: 16px;
          width: 100%;
        }

        sa-button {
          margin-right: auto;
          margin-top: 16px;
        }

        sa-icon[part=icon] {
          --icon-color: #42be65;
        }

        sa-label {
          --label-color: #ffffff;
        }

        sa-label[part=message] {
          padding-top: 4px;
        }
      </style>
      <sa-icon part="icon" name="check_circle" filled></sa-icon>
      <sa-box direction="column">
        <sa-label part="label" size="s" weight="bold"></sa-label>
        <sa-label part="message" size="s"></sa-label>      
        <sa-button size="m"></sa-button>
      </sa-box>
      <button part="close" type="button">
        <sa-icon name="close" size="s"></sa-icon>
      </button>
    `;

    // Properties
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';    

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$action = this.shadowRoot.querySelector( 'sa-button' );
    this.$action.addEventListener( this._touch, () => {
      this.dispatchEvent( new CustomEvent( 'sa-action', {
        bubbles: true,
        cancelable: false,
        composed: true
      } ) );
    } );
    this.$close = this.shadowRoot.querySelector( 'button' );
    this.$close.addEventListener( this._touch, () => {
      this.dispatchEvent( new CustomEvent( 'sa-close' ) );
    } );
    this.$label = this.shadowRoot.querySelector( 'sa-label[part=label]' );
    this.$message = this.shadowRoot.querySelector( 'sa-label[part=message]' );
  }

  // When attributes change
  _render() {
    this.$action.label = this.action === null ? '' : this.action;
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
    this._upgrade( 'action' );      
    this._upgrade( 'hidden' );  
    this._upgrade( 'label' );  
    this._upgrade( 'message' );  
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'action',
      'hidden',
      'label',
      'message'
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
  get action() {
    if( this.hasAttribute( 'action' ) ) {
      return this.getAttribute( 'action' );
    }

    return null;
  }

  set action( value ) {
    if( value !== null ) {
      this.setAttribute( 'action', value );
    } else {
      this.removeAttribute( 'action' );
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
}

window.customElements.define( 'sa-notification', StogieNotification );
