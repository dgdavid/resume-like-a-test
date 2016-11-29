import data from './data'
import config from './config'
import pdf from './Document'
import { findMarkdownLink } from './utils'

const INDENT = '  '
const CHECK_MARK = '\u2713'

class ResumeSectionItem {
  static render(item) {
    const [hasLink, itemWithLink] = findMarkdownLink(item)

    pdf.fontSize(config.section.itemSize)

    pdf.fill(config.section.bulletColor)
    pdf.text(`${INDENT} ${CHECK_MARK} `, { continued: true })

    pdf.fill(config.section.itemColor)

    if (hasLink) {
      ResumeSectionItem.renderWithLink(itemWithLink)
    } else {
      pdf.text(item)
    }
  }

  static renderWithLink(itemWithLink) {
    const input = itemWithLink.input
    const linkLength = itemWithLink[0].length
    const linkIndex = itemWithLink.index
    const linkCaption = itemWithLink[2]
    const linkUrl = itemWithLink[3]

    pdf.text(input.slice(0, linkIndex), { continued: true })
    pdf.text(linkCaption, { continued: true, link: linkUrl, underline: config.underlineLinks })
    pdf.text(input.slice(linkIndex + linkLength), { continued: true, link: false, underline: false })
    pdf.newLine()
  }
}

export default ResumeSectionItem
