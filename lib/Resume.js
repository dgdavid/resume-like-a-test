import config from './config'

const INDENT = '  '
const CHECK_MARK = '\u2713'
const HEAVY_CHECK_MARK = '\u2714'
const MARKDOWN_LINK_REGEXP = /(\[(.*?)\]\()(.+?)(\))/

class Resume {
  constructor(data) {
    this.data = data
  }

  get currentPage() { return this.doc.page }

  get pageSize() {
    const { width, height } = this.currentPage

    return { width, height }
  }

  // TODO: catch errors
  get nameConfig() {
    const { size, color } = config.name

    return { size, color }
  }

  get currentMargins() { return this.currentPage.margins }

  write() {
    this._prepareDocument()

    this._renderPreHeader()
    this._renderHeader()
    this._renderSections()

    this.doc.end()
  }

  _prepareDocument() {
    this.doc = new PDFDocument(this.documentConfig)
    this.doc.pipe(fs.createWriteStream(filename))
    this.doc.font('./fonts/MesloLG-S-DZ-Regular-for-Powerline.otf')
    this.doc.fill(config.document.color)

    if (config.document.background) {
      this._setBackground() // necessary for the first page

      this.doc.on('pageAdded', () => { this._setBackground() })
    }
  }

  _setBackground() {
    this.doc
      .rect(0, 0, this.pageSize.width, this.pageSize.height)
      .fill(config.document.background)

    pdf.fill(config.document.color) // restore the fill color
  }

  _renderPreHeader() {
    const labelHeight = 20
    const labelWidth = 50
    const labelYOffset = (labelHeight - config.document.baseFontSize) / 2

    this.doc
      .rect(0, 0, labelWidth, labelHeight)
      .fill(config.labelBackground)

    this.doc
      .fontSize(config.document.baseFontSize)
      .fill(config.document.background)
      .text(config.labelText, 0, labelYOffset, { width: 50, align: 'center' })

    if (config.fakeTestFileText) {
      this.doc
        .fill(config.fakeTestFileColor)
        .text(config.fakeTestFileText, labelWidth + 10, labelYOffset)
    }

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
        .fontSize(config.section.titleSize)
        .fill(config.section.titleColor)
        .text(section.title, { lineGap: config.lineGap })

      section.items.forEach(item => this._renderItem(item))

      this.doc.text(' ') // new line
    })
  }

  _renderItem(item) {
    const itemColor = config.section.itemColor || config.document.color
    const linkMatch = item.match(MARKDOWN_LINK_REGEXP)

    this.doc.fontSize(this.config.section.itemSize)

    this.doc
      .fillColor(config.section.bulletColor)
      .text(`${INDENT} ${HEAVY_CHECK_MARK} `, { continued: true, lineGap: config.lineGap })

    this.doc.fillColor(itemColor)

    linkMatch ? this._renderItemWithLink(linkMatch) : this.doc.text(item)
  }

  _renderItemWithLink(linkMatch) {
    const input = linkMatch.input
    const linkLength = linkMatch[0].length
    const linkIndex = linkMatch.index
    const linkCaption = linkMatch[2]
    const linkUrl = linkMatch[3]

    this.doc
      .text(input.slice(0, linkIndex), { continued: true, lineGap: config.lineGap })
      .text(linkCaption, { continued: true, link: linkUrl, underline: config.underlineLinks })
      .text(input.slice(linkIndex + linkLength), { continued: true, link: false, underline: false })
      .text(' ')
  }
}

export default Resume
