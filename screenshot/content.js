function screenshot(src) {
  let img = new Image()
  img.src = src
  document.body.appendChild(img)
}

let innerHeight = window.innerHeight
let innerWidth = window.innerWidth


let first = true
let y = 0
let height
let orginy


function getWH() {
  return { width: innerWidth, height: document.body.scrollHeight }
}

function setEnd(params) {
  y = 0
  first = true
  document.documentElement.scrollTop = orginy
}

function scrollY() {
  if (first) {
    first = false
    orginy = document.documentElement.scrollTop
    document.documentElement.scrollTop = 0
    return { x: 0, y: 0, width: innerWidth, height: innerHeight }
  }
  let oldy = y
  y = document.documentElement.scrollTop + innerHeight
  document.documentElement.scrollTop = y
  let end = y !== document.documentElement.scrollTop
  return { x: 0, y: y, width: innerWidth, height: document.documentElement.scrollTop - oldy, end: end }
}