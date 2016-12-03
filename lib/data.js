import fs from 'fs'
import yaml from 'yaml-js'

const data = yaml.load(fs.readFileSync('./data.yaml'))

export default data

