import fs from 'fs'
import yaml from 'yaml-js'
import Resume from './lib/Resume'

console.log('\x1B[2J\x1B[0f') // clear terminal, https://gist.github.com/KenanSulayman/4990953

console.log('\nLoading `config.yaml` ...')
const configFile = fs.readFileSync('./config.yaml')
const config = yaml.load(configFile)

console.log('\nLoading `data.yaml` ...')
const dataFile = fs.readFileSync('./resume.yaml')
const data = yaml.load(dataFile)

console.log('\nWritting the resume...')
new Resume(data, config).writeTo(config.outputFile)

console.log(`\nResume was created at ${config.outputFile}.`)
