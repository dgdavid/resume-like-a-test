import data from './data'
import config from './config'
import pdf from './Document'

class ResumeHeader {
  static render() {
    if (!data.header) {
      return
    }

    const horizontalGap = 10
    const verticalGap = 3
    const { label, text } = data.header
    let labelWidth = 0
    let labelHeight = 0

    if (label) {
      labelWidth = pdf.widthOfString(label) + horizontalGap * 2
      labelHeight = pdf.currentLineHeight() + verticalGap * 2

      pdf
        .rect(0, 0, labelWidth, labelHeight)
        .fill(config.header.labelBackground)
      pdf
        .fill(config.header.labelColor)
        .text(label, 0, verticalGap, { width: labelWidth, height: labelHeight, align: 'center' })
    }

    if (text) {
      const x = labelWidth ? labelWidth + horizontalGap : horizontalGap

      pdf
        .fill(config.header.textColor)
        .text(text, x, verticalGap)
    }
  }
}

export default ResumeHeader
