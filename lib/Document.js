import fs from 'fs'
import config from './config'
import { isWhite } from './utils'
import PDFDocument from 'pdfkit'

class Document extends PDFDocument {
  constructor(options) {
    super(options)

    if (!isWhite(options.background)) {
      this.on('pageAdded', () => { this._setBackground(options.background) })
      this.emit('pageAdded') // necessary to apply changes in first page
    }

    options.baseFont && this.font(options.baseFont)

    options.baseFontSize && this.fontSize(options.baseFontSize)
  }

  get margins() { return this.page.margins }

  get pageSize() { return { width: this.page.width, height: this.page.height } }

  get contentWidth() {
    const { left, right } = this.margins

    return this.pageSize.width - (left + right)
  }

  _setBackground(background, color) {
    this
      .fill(background)
      .rect(0, 0, this.page.width, this.page.height)
      .fill(color) // restore the fill color
  }
}

const document = new Document(config.document)
document.pipe(fs.createWriteStream(config.outputFilename))

export default document
