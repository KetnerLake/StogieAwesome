customElements.define( 'sa-random-quote', class extends HTMLElement {
  connectedCallback() {
    const random = Math.floor( this.children.length * Math.random() );
    for( let c = 0; c < this.children.length; c++ ) {
      this.children[c].hidden = c === random ? false : true;
    }
  }
} );
