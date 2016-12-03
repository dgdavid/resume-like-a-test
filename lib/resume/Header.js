import data from '../data'
import config from '../config'
import pdf from '../Document'

const headerConfig = config.header
const HORIZONTAL_GAP = headerConfig && headerConfig.horizontalGap || 10
const VERTICAL_GAP = headerConfig && headerConfig.verticalGap || 3

/*
 * Renders the header of document
 *
 * In this project, the header consists in a label placed on the top edge of
 * document and/or a simple line of text.
 *
 */
class Header {
  static render() {
    if (!data.header) {
      return
    }

    const { label, text } = data.header
    let labelWidth = 0
    let labelHeight = 0

    headerConfig.textSize && pdf.fontSize(headerConfig.textSize)

    if (label) {
      labelWidth = pdf.widthOfString(label) + HORIZONTAL_GAP * 2
      labelHeight = pdf.currentLineHeight() + VERTICAL_GAP * 2

      pdf
        .rect(0, 0, labelWidth, labelHeight)
        .fill(headerConfig.labelBackground)
      pdf
        .fill(headerConfig.labelColor)
        .text(label, 0, VERTICAL_GAP, { width: labelWidth, height: labelHeight, align: 'center' })
    }

    if (text) {
      const x = labelWidth ? labelWidth + HORIZONTAL_GAP : HORIZONTAL_GAP

      pdf
        .fill(headerConfig.textColor)
        .text(text, x, VERTICAL_GAP)
    }
  }
}

export default Header
