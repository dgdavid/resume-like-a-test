import data from './data'
import config from './config'
import pdf from './Document'
import { findMarkdownLink } from './utils'

const INDENT = '  '
const CHECK_MARK = '\u2713'

class ResumeSection {
  static render(section) {
    pdf.fontSize(config.section.titleSize)
    pdf.fill(config.section.titleColor)
    pdf.text(section.title)

    section.items.forEach((item) => ResumeSection.renderItem(item))

    pdf.newLine()
  }

  static renderItem(item) {
    const [hasLink, itemWithLink] = findMarkdownLink(item)

    pdf.fontSize(config.section.itemSize)

    pdf.fill(config.section.bulletColor)
    pdf.text(`${INDENT} ${CHECK_MARK} `, { continued: true })

    pdf.fill(config.section.itemColor)

    if (hasLink) {
      pdf.textWithLink(itemWithLink)
    } else {
      pdf.text(item)
    }
  }
}

export default ResumeSection