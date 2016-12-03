import data from '../data'
import Section from './Section'

/*
 * Responsible to render the body of document
 *
 * For now, the body consist only in sections and its items
 */
class Content {
  static render() {
    data.sections.forEach((section) => Section.render(section))
  }
}

export default Content
