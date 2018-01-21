const hasOwn = Object.prototype.hasOwnProperty

const compareOne = (a, b, keys) => {
  while (keys.length) {
    if (a == null || b == null) return a !== b
    const key = keys.shift()
    if (key !== '[]') {
      a = a[key]
      b = b[key]
    } else {
      if (!keys.length && a === b) return false

      let countA = 0
      let countB = 0

      for (let key in a) if (hasOwn.call(a, key)) countA++
      for (let key in b) if (hasOwn.call(b, key)) countB++

      if (countA !== countB) return true

      for (let key in a) {
        if (compareOne(a[key], b[key], keys.slice())) return true
      }
      return false
    }
  }
  return a !== b
}

const compare = (a, b, comparison = ['[]']) => {
  if (typeof comparison === 'function') return !!comparison(a, b)
  if (typeof comparison === 'string') comparison = [comparison]
  if (!(comparison instanceof Array)) {
    console.warn('compare(...): Called with invalid arguments')
  }

  for (const i in comparison) {
    const keys = comparison[i].replace('{}', '[]').split('.')
    if (compareOne(a, b, keys)) return true
  }
  return false
}

export default compare
