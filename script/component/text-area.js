export default class StogieTextArea extends HTMLElement {
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

        textarea {
          background: #ffffff;
          border: none;
          border-bottom: solid 1px #8d8d8d;          
          border-radius: 0;
          box-sizing: border-box;
          flex-basis: 0;
          flex-grow: 1;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 16px;
          font-weight: 400;
          height: 100%;
          margin: 0;
          min-height: 40px;
          outline-color: #00000000;
          outline-offset: -2px;
          outline-style: solid;
          outline-width: 2px;            
          padding: 11px 16px 11px 16px;
          resize: none;
          text-rendering: optimizeLegibility;
          -webkit-tap-highlight-color: transparent;
        }

        textarea::placeholder {
          color: #8d8d8d;
          opacity: 1.0;
        }
        
        textarea:focus {
          outline-color: #0f62fe;          
        }

        sa-label {
          padding: 0 0 6px 0;          
          --label-color: #8d8d8d;
        }

        :host( :not( [label] ) ) sa-label {
          display: none;
        }
      </style>
      <sa-label part="label" size="s"></sa-label>
      <textarea part="area"></textarea>    
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    this.$label = this.shadowRoot.querySelector( 'sa-label' );    

    this.$textarea = this.shadowRoot.querySelector( 'textarea' );
    this.$textarea.addEventListener( 'input', () => {
      this.value = this.$textarea.value.trim().length === 0 ? null : this.$textarea.value;
      this.dispatchEvent( new CustomEvent( 'sa-change', {
        detail: {
          value: this.value
        }
      } ) );
    } );    
  }

  clear( focus = true ) {
    this.value = null;

    if( focus ) {
      this.focus();
    }
  }

  focus() {
    this.$textarea.focus();
  }

  // When attributes change
  _render() {
    this.$textarea.placeholder = this.placeholder === null ? '' : this.placeholder;
    this.$textarea.value = this.value === null ? '' : this.value;
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
    this._upgrade( 'hidden' );  
    this._upgrade( 'label' );           
    this._upgrade( 'placeholder' );   
    this._upgrade( 'value' );          
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'hidden',
      'label',
      'placeholder',
      'value'
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
}

window.customElements.define( 'sa-text-area', StogieTextArea );
