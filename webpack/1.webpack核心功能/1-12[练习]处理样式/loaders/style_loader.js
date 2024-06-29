module.exports = function (srcCode) {
  const str = `
  const style = document.createElement('style')
  style.innerHTML = \`${srcCode}\`
  document.head.appendChild(style)
  `
  return str
}