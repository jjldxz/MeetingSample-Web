import EventEmitter from 'wolfy87-eventemitter'
import $ from 'jquery'

// 是否是网络图片地址
const allPicTypes = ['jpg', 'png', 'jpeg']
export function isNetWorkPicUrl(strPicUrl) {
  if (strPicUrl.indexOf('http') === 0 && strPicUrl.indexOf('.') > 0) {
    let picUrls = strPicUrl.split('.')
    return allPicTypes.indexOf(picUrls[picUrls.length - 1]) > -1
  }
  return false
}

export function getColor() {
  let colorValue = '0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f'
  let colorArray = colorValue.split(',')
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += colorArray[Math.floor(Math.random() * 16)]
  }
  return color
}

export function getHexBackgroundColor(color) {
  let rgb = color
  if (color.includes('rgb')) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
    function hex(x) {
      return ('0' + parseInt(x).toString(16)).slice(-2)
    }
    rgb = `#${hex(rgb[1])}${hex(rgb[2])}${hex(rgb[3])}`
  }
  return rgb
}

export function textSize(fontSize, fontFamily, text) {
  const span = document.createElement('span')
  let result = { width: span.offsetWidth, height: span.offsetHeight }
  span.style.visibility = 'hidden'
  span.style.fontSize = fontSize + 'px'
  span.style.fontFamily = fontFamily
  span.style.display = 'inline-block'
  document.body.appendChild(span)
  if (typeof span.textContent != 'undefined') {
    span.textContent = text
  } else {
    span.innerText = text
  }
  result.width = parseFloat(window.getComputedStyle(span).width) - result.width
  result.height = parseFloat(window.getComputedStyle(span).height) - result.height
  // $(span).remove();
  return result
}

export function getFontSize(text, textArea, fontFamily, fontSize = 40) {
  const span = document.createElement('span')
  const offset = { width: span.offsetWidth, height: span.offsetHeight }
  let matchFontSize = fontSize
  span.style.display = 'inline-block'
  span.style.visibility = 'hidden'
  span.style.fontSize = fontSize + 'px'
  span.style.fontFamily = fontFamily
  document.body.appendChild(span)
  if (typeof span.textContent != 'undefined') {
    span.textContent = text
  } else {
    span.innerText = text
  }
  let width = parseFloat(window.getComputedStyle(span).width) - offset.width
  let height = parseFloat(window.getComputedStyle(span).height) - offset.height

  let area = Number(width * height)
  function searchUp() {
    matchFontSize += 2
    span.style.fontSize = matchFontSize + 'px'
    let width = parseFloat(window.getComputedStyle(span).width) - offset.width
    let height = parseFloat(window.getComputedStyle(span).height) - offset.height
    let area = Number(width * height)
    if (textArea > area) {
      searchUp()
    }
  }
  function searchDown() {
    let tmpSize = matchFontSize - 2
    span.style.fontSize = tmpSize + 'px'
    let width = parseFloat(window.getComputedStyle(span).width) - offset.width
    let height = parseFloat(window.getComputedStyle(span).height) - offset.height
    let area = width * height
    if (textArea < area) {
      matchFontSize = tmpSize
      searchDown()
    } else if (textArea === area) {
      matchFontSize = tmpSize
    }
  }
  if (textArea > area) {
    searchUp()
  } else if (textArea < area) {
    searchDown()
  }
  $(span).remove()
  return matchFontSize
}

export const bus = new EventEmitter()
