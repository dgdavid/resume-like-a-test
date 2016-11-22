import data from './data'
import config from './config'
import pdf from './Document'

import ResumeHeader from './ResumeHeader'
import ResumeTitle from './ResumeTitle'

const INDENT = '  '
const CHECK_MARK = '\u2713'
const HEAVY_CHECK_MARK = '\u2714'
const MARKDOWN_LINK_REGEXP = /(\[(.*?)\]\()(.+?)(\))/

class Resume {
  static generate () {
    ResumeHeader.render()
    ResumeTitle.render()
    pdf.end()
  }

  // TODO: catch errors
  get nameConfig() {
    const { size, color } = config.name

    return { size, color }
  }

  write() {
    this._renderPreHeader()
    this._renderHeader()
    this._renderSections()

    pdf.end()
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
