import data from '../data'
import config from '../config'
import pdf from '../Document'

class Title {
  static render() {
    const { size, color } = config.title

    size && pdf.fontSize(size)
    color && pdf.fill(color)

    data.picture ? Title.withPicture() : Title.simple()
  }

  static simple() {
    const fullName = [data.firstName, data.lastName].join(' ').trim()

    if (fullName.length === 0) {
      throw 'Invalid name given'
    }

    pdf.text(fullName, pdf.margins.left, 30, { width: pdf.contentWidth, align: 'center' })
  }

  static withPicture() {
    if (!data.picture) {
      throw 'Picture not found'
    }

    const { firstName, lastName } = data
    const pictureSize = 150
    const halfPictureSize = pictureSize / 2
    const pictureX = pdf.pageSize.width / 2 - halfPictureSize
    const pictureY = 30

    const textGap = 10
    const textY = (pictureY + pictureSize) / 2 - config.title.size / 2
    const textWidth = pdf.pageSize.width / 2 - halfPictureSize - textGap
    const leftTextX = 0
    const rightTextX = pdf.pageSize.width / 2 + halfPictureSize + textGap

    pdf.image(data.picture, pictureX, pictureY, { width: pictureSize })

    firstName && pdf.text(firstName, leftTextX, textY, { width: textWidth, align: 'right' } )
    lastName && pdf.text(lastName, rightTextX, textY, { width: textWidth, align: 'left' } )

    // move document cursor position
    pdf.text(' ', pdf.margins.left, pictureSize - pictureY)
  }
}

export default Title
