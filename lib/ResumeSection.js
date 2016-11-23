import data from './data'
import config from './config'
import pdf from './Document'
import ResumeSectionItem from './ResumeSectionItem'

class ResumeSection {
  static render(section) {
    pdf.fontSize(config.section.titleSize)
    pdf.fill(config.section.titleColor)
    pdf.text(section.title)

    section.items.forEach((item) => ResumeSectionItem.render(item))

    pdf.text(' ') // new line
  }
}

export default ResumeSection
