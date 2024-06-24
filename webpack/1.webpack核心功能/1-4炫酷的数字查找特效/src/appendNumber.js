import getColor, { getRandom } from './util/radColor'

const divContainer = document.querySelector('#divContainer')
const divCenter = document.querySelector('#divCenter')

export default function (n, isPrime) {
  const color = getColor()
  const span = document.createElement('span')
  span.innerText = n
  divCenter.innerHTML = n
  if (isPrime) {
    span.style.color = color
    const center = document.createElement('div')
    center.setAttribute('class', 'center')
    center.style.color = color
    center.innerText = n
    document.body.appendChild(center)
    getComputedStyle(center).left
    const x = getRandom(-200, 200)
    const y = getRandom(-200, 200)
    center.style.transform = `translate(${x}px, ${y}px)`
    center.style.opacity = 0
  }
  divContainer.appendChild(span)
}