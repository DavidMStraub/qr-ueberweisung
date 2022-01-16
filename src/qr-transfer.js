
import {LitElement, css, html} from 'lit'
// import {girocode} from '@dipser/epc-qr-code.js'
import {girocode} from '../node_modules/@dipser/epc-qr-code.js/dist/epc-qr-code.esm.js'
import '@material/mwc-textfield'

const _data = {
  service: 'BCD',
  version: '002',
  encoding: '2',
  transfer: 'SCT',
  bic: '',
  name: '',
  iban: '',
  currency: 'EUR',
  amount: '',
  char: '',
  ref: '',
  reason: '',
  hint: ''
}

function _toString (gc) {
  return `
${gc._config.service}
${gc._config.version}
${gc._config.encoding}
${gc._config.transfer}
${gc._config.bic}
${gc._config.name}
${gc._config.iban}
${gc._config.currency}${gc._config.amount}
${gc._config.char}
${gc._config.ref}
${gc._config.reason}
`.trim()
}
class QrTransfer extends LitElement {
  static get properties () {
    return {
      data: {type: Object},
      dataUrl: {type: String},
      string: {type: String}
    }
  };

  static get styles () {
    return [
      css`
      .container {
        display: flex;
        flex-flow: row wrap;
      }

      .col1 {
        order: 1;
        width: 100%;
        padding: 0em 1.5em 1em 0em;
      }

      .col2 {
        order: 2;
        width: 100%;
        padding: 0em 1.5em 1em 0em;
      }

      @media (min-width: 600px) {
        .container {
          flex-flow: row nowrap;
        }

        .col1, .col2 {
          width: 50%;
        }
      }

      mwc-textfield {
        display: block;
        margin-bottom: 1em;
      }

      img {
        max-height: 50vh;
        max-width: 50vh;
      }

      h1 {
        font-weight: 200;
        font-size: 46px;
        margin-top: 0;
      }

      mwc-textfield {
        --mdc-typography-font-family: 'Titillium Web';
      }

      pre {
        font-family: Inconsolata;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.6);
      }
      `
    ]
  }

  constructor () {
    super()
    this.data = _data
    this.dataUrl = ''
    this.string = ''
  }

  _updateSvg () {
    const gc = girocode(this.data)
    this.dataUrl = gc.svg_data_url()
    this.string = _toString(gc)
  }

  render () {
    return html`
    <h1>QR-Überweisungs-Generator</h1>
    <div class="container">
      <div class="col1">
        <mwc-textfield
          @input="${this._handleInput}"
          id="name"
          label="Name des Empfängers"
          required
          charCounter
          maxLength="70"
          validationMessage="Pflichtfeld"
        ></mwc-textfield>
        <mwc-textfield
          @input="${this._handleInput}"
          id="iban"
          label="IBAN"
          pattern="[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}"
          validationMessage="Ungültige IBAN"
          required
        ></mwc-textfield>
        <mwc-textfield
          @input="${this._handleInput}"
          id="bic"
          label="BIC"
          pattern="[a-zA-Z]{4}[a-zA-Z]{2}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})"
          validationMessage="Ungültige BIC"
        ></mwc-textfield>
        <mwc-textfield
          @input="${this._handleInput}"
          id="amount"
          label="Betrag (€)"
          pattern="[0-9]+(\.[0-9]{1,2})?"
          validationMessage="Zulässiges Format: #.##"
        ></mwc-textfield>
        <mwc-textfield
          @input="${this._handleInput}"
          id="reason"
          label="Verwendungszweck"
          maxLength="140"
          charCounter
        ></mwc-textfield>
      </div>
      <div class="col2">
        ${this.dataUrl ? html`<img src="${this.dataUrl}" alt="QR code" />` : ''}
        ${this.string
    ? html`
        <p>Rohdaten:</p>
        <pre>${this.string}</pre>`
    : ''}
      </div>
    </div>
    `
  }

  updated (changed) {
    if (changed.has('data')) {
      this._updateSvg()
    }
  }

  _handleInput (e) {
    const fields = ['bic', 'name', 'iban', 'amount', 'reason']
    fields.forEach(elemId => {
      const element = this.shadowRoot.getElementById(elemId)
      if (!element) {
        return null
      }
      this.data = {...this.data, [elemId]: element.value}
    })
  }

  reset () {
    this.data = _data
  }
}
customElements.define('qr-transfer', QrTransfer)
