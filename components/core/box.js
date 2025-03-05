export default class StogieBox extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          position: relative;
        }

        :host( [carded] ) {
          background: #ffffff;
          border: solid 1px #e0e0e0;
          border-radius: 4px;
          box-sizing: border-box;
          flex-direction: column;
        }

        :host( [centered] ) {
          align-items: center;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [direction=column] ) {
          flex-direction: column;
        }
        :host( [direction=column-reverse] ) {
          flex-direction: column-reverse;
        }        
        :host( [direction=row-reverse] ) {
          flex-direction: row-reverse;
        }                

        :host( [hidden] ) {
          display: none;
        }

        :host( [justified] ) {
          justify-content: center;
        }

        :host( [flex] ) {
          flex-basis: 0;
          flex-grow: 1;
        }

        :host( [gap=xs] ) {
          gap: 2px;
        }
        :host( [gap=s] ) {
          gap: 4px;
        }       
        :host( [gap=m] ) {
          gap: 8px;
        }       
        :host( [gap=l] ) {
          gap: 16px;
        }        
        :host( [gap=xl] ) {
          gap: 32px;
        }        
      </style>
      <slot></slot>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );
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
    this._upgrade( 'centered' );      
    this._upgrade( 'concealed' );  
    this._upgrade( 'direction' );      
    this._upgrade( 'gap' );        
    this._upgrade( 'hidden' );  
    this._upgrade( 'justified' );        
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'carded',
      'centered',
      'concealed',
      'direction',
      'gap',      
      'hidden',
      'justified'
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

  get centered() {
    return this.hasAttribute( 'centered' );
  }

  set centered( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'centered' );
      } else {
        this.setAttribute( 'centered', '' );
      }
    } else {
      this.removeAttribute( 'centered' );
    }
  }

  get direction() {
    if( this.hasAttribute( 'direction' ) ) {
      return this.getAttribute( 'direction' );
    }

    return null;
  }

  set direction( value ) {
    if( value !== null ) {
      this.setAttribute( 'direction', value );
    } else {
      this.removeAttribute( 'direction' );
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

  get gap() {
    if( this.hasAttribute( 'gap' ) ) {
      return this.getAttribute( 'gap' );
    }

    return null;
  }

  set gap( value ) {
    if( value !== null ) {
      this.setAttribute( 'gap', value );
    } else {
      this.removeAttribute( 'gap' );
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

  get justified() {
    return this.hasAttribute( 'justified' );
  }

  set justified( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'justified' );
      } else {
        this.setAttribute( 'justified', '' );
      }
    } else {
      this.removeAttribute( 'justified' );
    }
  }    
}

window.customElements.define( 'sa-box', StogieBox );
