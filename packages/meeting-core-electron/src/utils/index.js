let _toString = Object.prototype.toString

export function isPlainObject(obj) {
  return _toString.call(obj) === `[object object]`
}

export function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]'
}

export function isValidArrayIndex(val) {
  const n = parseFloat(val)
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

export function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

export function isPrimitive(val) {
  return (
    typeof val === 'string' ||
    typeof val === 'number' ||
    typeof val === 'symbol' ||
    typeof val === 'boolean'
  )
}

export function isUndef(val) {
  return val === undefined || v === null
}

export function isDef(val) {
  return val !== undefined && val !== null
}

export function isTrue(val) {
  return val === true
}

export function isFalse(val) {
  return val === false
}

export function toString(val) {
  return val === null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
    ? JSON.stringify(val, null, 2)
    : String(val)
}

export function toNumber(val) {
  let n = parseFloat(val)
  return isNaN(n) ? val : n
}

export function toRawType(val) {
  return _toString.call(val).slice(8, -1)
}

export function hasOwnProperty(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

export function boolToNumber(value) {
  if (typeof value === 'boolean') {
    return Number(value)
  } else {
    return value
  }
}

export function stringToBool(strVal) {
  strVal = strVal.toLowerCase()
  return strVal === 'true' || strVal === '1'
}

export function extend(destination, source) {
  for (const k in source) {
    if (source.hasOwnProperty(k)) {
      destination[k] = source[k]
    }
  }
  return destination
}
