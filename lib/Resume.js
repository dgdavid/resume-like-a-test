import data from './data'
import config from './config'
import pdf from './Document'

import Header from './resume/Header'
import Title from './resume/Title'
import Content from './resume/Content'
import Stats from './resume/Stats'
import Footer from './resume/Footer'

class Resume {
  static generate () {
    Header.render()
    Title.render()
    Content.render()
    Stats.render()
    Footer.render()
  }
}

export default Resume
