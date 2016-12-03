import data from '../data'
import Section from './Section'

class Content {
  static render() {
    data.sections.forEach((section) => Section.render(section))
  }
}

export default Content
