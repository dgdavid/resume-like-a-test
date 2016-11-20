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
    this._prepareDocument()
    this.doc.pipe(fs.createWriteStream(filename))

    this._renderHeader()
    this._renderSections()

    this.doc.end()
  }

  _prepareDocument() {
    this.doc = new PDFDocument(this.documentConfig)

    this.doc.font('./fonts/MesloLG-S-DZ-Regular-for-Powerline.otf')
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
    console.log('Page size', this.pageSize)
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
