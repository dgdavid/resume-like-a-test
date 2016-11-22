import fs from 'fs'
import yaml from 'yaml-js'

const config = yaml.load(fs.readFileSync('./resume.yaml'))

export default config

