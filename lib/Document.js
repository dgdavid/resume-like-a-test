import fs from 'fs'
import config from './config'
import PDFDocument from 'pdfkit'

class Document extends PDFDocument {
  get margins() { return this.page.margins }

  get pageSize() { return { width: this.page.width, height: this.page.height } }
}

const document = new Document(config.document)
document.pipe(fs.createWriteStream(config.outputFilename))

export default document
