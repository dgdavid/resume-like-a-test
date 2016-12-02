import data from './data'
import config from './config'
import pdf from './Document'

const INDENT = ' '.repeat(config.stats && config.stats.indent || 5)

/*
 * Responsible to render the statistics zone
 *
 * Currently has three statistics types:
 *
 *  - Sections
 *  - Items
 *  - Links
 *
 * Stats items in `data` with some of these case can use the `%n` placeholder to
 * replace in its label or text by the counter value.
 *
 * Stats items with any other key will be rendered as is, without performing
 * replacements.
 */
class ResumeStats {
  static render() {
    if(!data.stats) {
      return
    }

    pdf.fontSize(config.stats.textSize)

    data.stats.forEach((item) => {
      let { label, text } = item

      try {
        let count = ResumeStats[`count${item.key}`]()
        text = text.replace('%n', count)
        label = label.replace('%n', count)
      } catch (e) {
        // Yes, It's necessary to have a catch statement here :/
      } finally {
        pdf.text(INDENT, { continued: true })

        pdf.fill(item.labelColor || config.stats.labelColor)
        pdf.text(label, { continued: true })

        pdf.fill(item.textColor || config.stats.textColor)
        pdf.text(text)
      }
    })
  }

  /*
   * Returns sections length
   *
   * @return {number}
   */
  static countSections() {
    return data.sections.length
  }

  /*
   * Returns items length
   *
   * @return {number}
   */
  static countItems() {
    return data.sections.reduce((total, section) => total + section.items.length, 0)
  }

  /*
   * Returns links annotations in current page
   *
   * IMPORTANT: only count those links rendered until the method was called.
   *
   * @todo count total links in the whole document, or at least all links in
   * document until the method was called.
   *
   * @return {number}
   */
  static countLinks() {
    return pdf.page.annotations.filter((a) => a.data.Subtype === 'Link').length
  }
}

export default ResumeStats
