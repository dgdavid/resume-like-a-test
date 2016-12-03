import config from './lib/config'
import pdf from './lib/Document'
import Resume from './lib/Resume'

console.log('\x1B[2J\x1B[0f') // clear terminal, https://gist.github.com/KenanSulayman/4990953

console.log('\nGenerating resume ...')
Resume.generate()

console.log('\nWriting document ...')
pdf.end()

console.log(`\nResume was created at ${config.outputFilename}`)
