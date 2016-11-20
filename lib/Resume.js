import fs from 'fs'
import PDFDocument from 'pdfkit'

class Resume {
  constructor(data, config) {
    this.data = data
    this.config = Object.assign({ lineGap: 5 }, config)
    this.doc = undefined
  }

  get documentConfig() { return this.config.document }

  get currentPage() { return this.doc.page }

  get pageSize() {
    const { width, height } = this.currentPage

    return { width, height }
  }

  get currentMargins() { return this.currentPage.margins }

  writeTo(filename) {
    this._prepareDocument(filename)

    this._renderHeader()
    this._renderSections()

    this.doc.end()
  }

  _prepareDocument(filename) {
    this.doc = new PDFDocument(this.documentConfig)
    this.doc.pipe(fs.createWriteStream(filename))

    this.doc.font('./fonts/MesloLG-S-DZ-Regular-for-Powerline.otf')
    this.doc.fill(this.documentConfig.color)

    if (this.documentConfig.background) {
      this._setBackground() // necessary for the first page

      this.doc.on('pageAdded', () => { this._setBackground() })
    }
  }

  _setBackground() {
    this.doc
      .rect(0, 0, this.pageSize.width, this.pageSize.height)
      .fill(this.documentConfig.background)

    this.doc.fill(this.documentConfig.color) // restore the fill color
  }

  _renderHeader() {
    this.doc.fontSize(40)

    if (this.data.picture) {
      // print picture
    } else {
      this.doc.text(`${this.data.first_name} ${this.data.last_name}`, {
        width: this._widthWithoutMargins(),
        align: 'center'
      })
    }

    this.doc.fontSize(12)
  }

  _widthWithoutMargins() {
    return this.currentPage.width - (this.currentMargins.left + this.currentMargins.right)
  }

  _renderSections() {
    this.data.sections.forEach((section) => {
      this.doc.text(section.title)

      section.items.forEach((item) => {
        this.doc.text(item)
      })
    })
  }
}

export default Resume
