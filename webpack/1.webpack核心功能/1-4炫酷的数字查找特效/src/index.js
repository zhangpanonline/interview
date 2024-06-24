import NumberTimer from './util/number'
import appendNumber from './appendNumber'

const n = new NumberTimer()
n.onNumberCreated = function (n, isPrime) {
  appendNumber(n, isPrime)
}

n.start()

window.onclick = function () {
  n.timerId ? n.stop() : n.start()
}