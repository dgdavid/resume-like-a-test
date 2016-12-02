import data from './data'
import config from './config'
import pdf from './Document'

import ResumeHeader from './ResumeHeader'
import ResumeTitle from './ResumeTitle'
import ResumeContent from './ResumeContent'
import ResumeStats from './ResumeStats'
import ResumeFooter from './ResumeFooter'

class Resume {
  static generate () {
    ResumeHeader.render()
    ResumeTitle.render()
    ResumeContent.render()
    ResumeStats.render()
    ResumeFooter.render()
    pdf.end()
  }
}

export default Resume
