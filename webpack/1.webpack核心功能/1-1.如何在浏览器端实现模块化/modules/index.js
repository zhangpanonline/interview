// import a from './a.js'
// console.log('index')

const path = require('path')
const apPath = path.resolve(__dirname, './txt.txt')
const fs = require('fs')
const content = fs.readFileSync(apPath, { encoding: 'utf-8' })
console.log(content)