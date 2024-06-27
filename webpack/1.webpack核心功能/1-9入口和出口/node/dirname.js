/**
 * node中对于 ./ 路径分两种情况：
 * 1. 模块化过程中，比如require('./')，表示当前js文件所在目录
 * 2. 在路径处理中，比如 node 命令执行js文件，./ 表示 node 命令运行的目录
 * 
 * __dirname：所有情况下，都表示当前运行的js文件所在的目录，它是一个绝对路径
 */
const path = require('path')
console.log(__dirname)
console.log(path.resolve('./'))
/**
 * 在当前目录执行：
 * D:\workspace\zpan\interview\webpack\1.webpack核心功能\1-9入口和出口\node
 * D:\workspace\zpan\interview\webpack\1.webpack核心功能\1-9入口和出口\node
 */
/**
 * 在上级目录执行：
 * D:\workspace\zpan\interview\webpack\1.webpack核心功能\1-9入口和出口\node
 * D:\workspace\zpan\interview\webpack\1.webpack核心功能\1-9入口和出口
 */