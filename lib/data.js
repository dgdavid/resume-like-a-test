import fs from 'fs'
import yaml from 'yaml-js'

const data = yaml.load(fs.readFileSync('./resume.yaml'))

export default data

