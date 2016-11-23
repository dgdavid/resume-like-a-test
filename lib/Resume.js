import data from './data'
import config from './config'
import pdf from './Document'

import ResumeHeader from './ResumeHeader'
import ResumeTitle from './ResumeTitle'
import ResumeContent from './ResumeContent'

class Resume {
  static generate () {
    ResumeHeader.render()
    ResumeTitle.render()
    ResumeContent.render()
    pdf.end()
  }
}

export default Resume
