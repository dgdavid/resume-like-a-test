import fs from 'fs'
import yaml from 'yaml-js'
import config from './lib/config'
import Resume from './lib/Resume'

console.log('\x1B[2J\x1B[0f') // clear terminal, https://gist.github.com/KenanSulayman/4990953

console.log('\nLoading `data.yaml` ...')
const dataFile = fs.readFileSync('./resume.yaml')
const data = yaml.load(dataFile)

console.log('\nWritting the resume...')
Resume.generate()

console.log(`\nResume was created at ${config.outputFile}.`)
