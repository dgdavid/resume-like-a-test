import config from './config'
import pdf from './Document'

const INDENT = '  '
const CHECK_MARK = '\u2713'
const HEAVY_CHECK_MARK = '\u2714'
const MARKDOWN_LINK_REGEXP = /(\[(.*?)\]\()(.+?)(\))/

class Resume {
  constructor(data) {
    this.data = data
  }

  // TODO: catch errors
  get nameConfig() {
    const { size, color } = config.name

    return { size, color }
  }

  write() {
    this._prepareDocument()

    this._renderPreHeader()
    this._renderHeader()
    this._renderSections()

    pdf.end()
  }

  _prepareDocument() {
    pdf.font('./fonts/MesloLG-S-DZ-Regular-for-Powerline.otf')
    pdf.fill(config.document.color)

    if (config.document.background) {
      this._setBackground() // necessary for the first page

      pdf.on('pageAdded', () => { this._setBackground() })
    }
  }

  _setBackground() {
    pdf
      .rect(0, 0, pdf.pageSize.width, pdf.pageSize.height)
      .fill(config.document.background)

    pdf.fill(config.document.color) // restore the fill color
  }

  _renderPreHeader() {
    const labelHeight = 20
    const labelWidth = 50
    const labelYOffset = (labelHeight - config.document.baseFontSize) / 2

    pdf
      .rect(0, 0, labelWidth, labelHeight)
      .fill(config.labelBackground)

    pdf
      .fontSize(config.document.baseFontSize)
      .fill(config.document.background)
      .text(config.labelText, 0, labelYOffset, { width: 50, align: 'center' })

    if (config.fakeTestFileText) {
      pdf
        .fill(config.fakeTestFileColor)
        .text(config.fakeTestFileText, labelWidth + 10, labelYOffset)
    }

  }

  _renderHeader() {
    const nameConfig = this.nameConfig
    const nameSize = nameConfig.size || 40

    pdf.fontSize(nameSize)
    pdf.fill(nameConfig.color)

    if (!this.data.picture) {
      pdf.text(`${this.data.first_name} ${this.data.last_name}`, {
        width: this._widthWithoutMargins(),
        align: 'center'
      })

      return
    }

    if (this.data.picture) {
      const pictureSize = 150
      const halfPictureSize = pictureSize / 2
      const pictureX = pdf.pageSize.width / 2 - halfPictureSize
      const pictureY = 30

      const textMargin = 10
      const textY = (pictureY + pictureSize) / 2 - nameSize / 2
      const textWidth = pdf.pageSize.width / 2 - halfPictureSize - textMargin
      const leftTextX = 0
      const rightTextX = pdf.pageSize.width / 2 + halfPictureSize + textMargin

      pdf.image(this.data.picture, pictureX, pictureY, { width: pictureSize })

      pdf.text(this.data.first_name, leftTextX, textY, { width: textWidth, align: 'right' } )
      pdf.text(this.data.last_name, rightTextX, textY, { width: textWidth, align: 'left' } )

      pdf.text(' ', pdf.margins.left, pictureSize - pictureY) // necessary to move the cursor
    }
  }

  _widthWithoutMargins() {
    return this.currentPage.width - (pdf.margins.left + pdf.margins.right)
  }

  _renderSections() {
    this.data.sections.forEach((section) => {
      pdf
        .fontSize(config.section.titleSize)
        .fill(config.section.titleColor)
        .text(section.title, { lineGap: config.lineGap })

      section.items.forEach(item => this._renderItem(item))

      pdf.text(' ') // new line
    })
  }

  _renderItem(item) {
    const itemColor = config.section.itemColor || config.document.color
    const linkMatch = item.match(MARKDOWN_LINK_REGEXP)

    pdf.fontSize(config.section.itemSize)

    pdf
      .fillColor(config.section.bulletColor)
      .text(`${INDENT} ${HEAVY_CHECK_MARK} `, { continued: true, lineGap: config.lineGap })

    pdf.fillColor(itemColor)

    linkMatch ? this._renderItemWithLink(linkMatch) : pdf.text(item)
  }

  _renderItemWithLink(linkMatch) {
    const input = linkMatch.input
    const linkLength = linkMatch[0].length
    const linkIndex = linkMatch.index
    const linkCaption = linkMatch[2]
    const linkUrl = linkMatch[3]

    pdf
      .text(input.slice(0, linkIndex), { continued: true, lineGap: config.lineGap })
      .text(linkCaption, { continued: true, link: linkUrl, underline: config.underlineLinks })
      .text(input.slice(linkIndex + linkLength), { continued: true, link: false, underline: false })
      .text(' ')
  }
}

export default Resume
