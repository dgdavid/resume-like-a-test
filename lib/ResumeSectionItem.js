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
      pdf.textWithLink(itemWithLink)
    } else {
      pdf.text(item)
    }
  }
}

export default ResumeSectionItem
