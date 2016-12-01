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

  /*
   * Forces a new line
   *
   * @return {undefined}
   */
  newLine() {
    this.text(' ')
  }

  /*
   * Allows to write text in vertical
   *
   * @desc Saves the context, rotates the document and writes the given text in
   * vertical, from left and bottom to right and top.
   *
   * @param {String} text - the text to write
   * @param {number} x - the desired distance from left (bottom in the original
   *                     document orientation)
   * @param {number} y - the desired distance from bottom (left in the original
   *                     document orientation)
   * @param {object} args - remaining args accepted by {@link PDFDocument#text}
   *
   * @return {undefined}
   */
  verticalText(text, x, y, ...args) {
    const previousX = this.x
    const previousY = this.y
    const recalculatedX = y - this.pageSize.height
    const recalculatedY = x

    this.save()

    this.rotate(270)
    this.text(text, recalculatedX, recalculatedY, ...args)

    this.restore()

    this.x = previousX
    this.y = previousY
  }

  _setBackground(background, color) {
    this
      .fill(background)
      .rect(0, 0, this.page.width, this.page.height)
      .fill(color) // restore the fill color
  }

  /*
   * Render a properly a text with links
   *
   * @param {object} textWithLink - the text that contains a link
   * @param {object} args - remaining args accepted by {@link PDFDocument#text}
   *
   * @return {undefined}
   */
  textWithLink(textWithLink, ...args) {
    console.log(typeof textWithLink)
    const input = textWithLink.input
    const linkLength = textWithLink[0].length
    const linkIndex = textWithLink.index
    const linkCaption = textWithLink[2]
    const linkUrl = textWithLink[3]

    let opts = {}

    if (typeof args[args.length -1] === 'object') {
      opts = args.pop()
    }

    this.text(input.slice(0, linkIndex), ...args, {...opts, continued: true })
    this.text(linkCaption, { ...opts, continued: true, link: linkUrl, underline: config.underlineLinks })
    this.text(input.slice(linkIndex + linkLength), { ...opts, continued: true, link: false, underline: false })

    if (opts.newLine === false) {
      return
    }

    this.newLine()
  }
}

const document = new Document(config.document)
document.pipe(fs.createWriteStream(config.outputFilename))

export default document
