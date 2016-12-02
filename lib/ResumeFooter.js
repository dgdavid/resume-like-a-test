import data from './data'
import config from './config'
import pdf from './Document'

const footerConfig = config.footer
const HORIZONTAL_GAP = footerConfig && footerConfig.horizontalGap || 10
const VERTICAL_GAP = footerConfig && footerConfig.verticalGap || 3

/*
 * Renders footer of document
 *
 * Likewise that {ResumeHeader}, it's designed to can render a label and a line
 * of text. In this case, the label was be placed at right of document, while
 * the text start in the left margin.
 *
 */
class ResumeFooter {
  static render() {
    if (!data.footer) {
      return
    }

    const pageSize = pdf.pageSize
    const { label, text } = data.footer
    let labelWidth = 0
    let labelHeight = 0

    pdf.fontSize(footerConfig.textSize)

    if (label) {
      labelWidth = pdf.widthOfString(label) + HORIZONTAL_GAP * 2
      labelHeight = pdf.currentLineHeight() + VERTICAL_GAP * 2
      let labelX = pageSize.width - labelWidth
      let labelY = pageSize.height - labelHeight
      let labelTextY = labelY + VERTICAL_GAP

      pdf.rect(labelX, labelY, labelWidth, labelHeight)
      pdf.fill(footerConfig.labelBackground)

      pdf.fill(footerConfig.labelColor)
      pdf.text(label, labelX, labelTextY, { width: labelWidth, height: labelHeight, align: 'center' })
    }

    if (text) {
      const x = pdf.margins.right
      const y = pdf.pageSize.height - (pdf.currentLineHeight() + VERTICAL_GAP * 2)

      pdf.fill(footerConfig.textColor)
      pdf.text(text, x, y, { lineBreak: false })
    }
  }
}

export default ResumeFooter
