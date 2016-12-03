import fs from 'fs'
import config from './config'
import PDFDocument from 'pdfkit'
import { isWhite, findMarkdownLink } from './utils'

/*
 * Represent a PDF Document
 *
 * @extends {PDFDocument}
 */
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

  /*
   * Returns margin values
   *
   * Based on current page
   *
   * @return {object} current page's margins
   */
  get margins() { return this.page.margins }

  /*
   * Returns size of current page
   *
   * @return {object} current page's size
   */
  get pageSize() { return { width: this.page.width, height: this.page.height } }

  /*
   * Returns width of current page
   *
   * @return {object} current page's width
   */
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
   * @override
   */
  text(text, ...args) {
    const [hasLink, itemWithLink] = findMarkdownLink(text)

    if (hasLink) {
      this.textWithLink(itemWithLink, ...args)
    } else {
      super.text(text, ...args)
    }
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

  /*
   * Renders properly links into given text
   *
   * @note: currently only has support for one link
   * @todo: support multiple links
   *
   * @param {Object} textWithLink - object with text and link matches
   * @param {...Object} args - remaining args accepted by {@link PDFDocument#text}
   *
   * @return {undefined}
   */
  textWithLink(textWithLink, ...args) {
    let opts = {}
    const input = textWithLink.input
    const linkLength = textWithLink[0].length
    const linkIndex = textWithLink.index
    const linkCaption = textWithLink[2]
    const linkUrl = textWithLink[3]

    if (typeof args[args.length -1] === 'object') {
      opts = args.pop()
    }

    const linkOptions = {
      ...opts,
      continued: true,
      link: linkUrl,
      underline: config.underlineLinks
    }

    if (linkIndex > 0) {
      this.text(input.slice(0, linkIndex), ...args, {...opts, continued: true })
      this.text(linkCaption, linkOptions)
    } else {
      this.text(linkCaption, ...args, linkOptions)
    }

    this.text(input.slice(linkIndex + linkLength), {...opts, continued: true, link: false, underline: false })

    if (opts.newLine === false) {
      return
    }

    this.newLine()
  }

  /*
   * @private
   *
   * Sets a background drawing a square with page dimensions
   *
   * @return {undefined}
   */
  _setBackground(background) {
    const previousColor = this._fillColor && this._fillColor[0]

    this.rect(0, 0, this.page.width, this.page.height)
    this.fill(background)

    this.fill(previousColor) // restore the fill color
  }
}

const document = new Document(config.document)
document.pipe(fs.createWriteStream(config.outputFilename))

export default document
