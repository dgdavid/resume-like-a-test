import fs from 'fs'
import yaml from 'yaml-js'

const config = yaml.load(fs.readFileSync('./config.yaml'))

export default config
