import data from './data'
import ResumeSection from './ResumeSection'

class ResumeContent {
  static render() {
    data.sections.forEach((section) => ResumeSection.render(section))
  }
}

export default ResumeContent
