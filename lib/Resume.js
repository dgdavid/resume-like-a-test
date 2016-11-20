import fs from 'fs'
import PDFDocument from 'pdfkit'

const INDENT = '  '
const CHECK_MARK = '\u2713'
const HEAVY_CHECK_MARK = '\u2714'

class Resume {
  constructor(data, config) {
    this.data = data
    this.config = Object.assign({ lineGap: 5 }, config)
  }

  get documentConfig() { return this.config.document }

  get currentPage() { return this.doc.page }

  get pageSize() {
    const { width, height } = this.currentPage

    return { width, height }
  }

  // TODO: catch errors
  get nameConfig() {
    const { size, color } = this.config.name

    return { size, color }
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
    const nameConfig = this.nameConfig
    const nameSize = nameConfig.size || 40

    this.doc.fontSize(nameSize)
    this.doc.fill(nameConfig.color)

    if (!this.data.picture) {
      this.doc.text(`${this.data.first_name} ${this.data.last_name}`, {
        width: this._widthWithoutMargins(),
        align: 'center'
      })

      return
    }

    if (this.data.picture) {
      const pictureSize = 150
      const halfPictureSize = pictureSize / 2
      const pictureX = this.pageSize.width / 2 - halfPictureSize
      const pictureY = 30

      const textMargin = 10
      const textY = (pictureY + pictureSize) / 2 - nameSize / 2
      const textWidth = this.pageSize.width / 2 - halfPictureSize - textMargin
      const leftTextX = 0
      const rightTextX = this.pageSize.width / 2 + halfPictureSize + textMargin

      this.doc.image(this.data.picture, pictureX, pictureY, { width: pictureSize })

      this.doc.text(this.data.first_name, leftTextX, textY, { width: textWidth, align: 'right' } )
      this.doc.text(this.data.last_name, rightTextX, textY, { width: textWidth, align: 'left' } )

      this.doc.text(' ', this.currentMargins.left, pictureSize - pictureY) // necessary to move the cursor
    }
  }

  _widthWithoutMargins() {
    return this.currentPage.width - (this.currentMargins.left + this.currentMargins.right)
  }

  _renderSections() {
    this.data.sections.forEach((section) => {
      this.doc
        .fontSize(this.config.section.titleSize)
        .fill(this.config.section.titleColor)
        .text(section.title, { lineGap: this.config.lineGap })

      section.items.forEach(item => this._renderItem(item))

      this.doc.text(' ') // new line
    })
  }

  _renderItem(item) {
    const itemColor = this.config.section.itemColor || this.config.document.color

    this.doc
      .fontSize(this.config.section.itemSize)

    this.doc
      .fillColor(this.config.section.bulletColor)
      .text(`${INDENT} ${HEAVY_CHECK_MARK} `, { continued: true, lineGap: this.config.lineGap })

    this.doc
      .fillColor(itemColor)
      .text(item)
  }
}

export default Resume
