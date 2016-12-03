import data from '../data'
import config from '../config'
import pdf from '../Document'

// @todo: allow to config indent and bullet
const INDENT = '  '
const CHECK_MARK = '\u2713'

/*
 * Render given sections and its items
 */
class Section {
  static render(section) {
    pdf.fontSize(config.section.titleSize)
    pdf.fill(config.section.titleColor)
    pdf.text(section.title)

    section.items.forEach((item) => Section.renderItem(item))

    pdf.newLine()
  }

  static renderItem(item) {
    pdf.fontSize(config.section.itemSize)

    pdf.fill(config.section.bulletColor)
    pdf.text(`${INDENT} ${CHECK_MARK} `, { continued: true })

    pdf.fill(config.section.itemColor)
    pdf.text(item)
  }
}

export default Section
