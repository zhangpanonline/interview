function loader(buffer) {
  return "data:image/png;base64," + buffer.toString('base64')
}

loader.raw = true

module.exports = loader