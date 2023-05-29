const deepTraverse = (fn) => {
  const t = (obj, path = []) => {
    const result = fn(obj, path)
    if (typeof result !== 'undefined') {
      return result
    }

    switch (typeof obj) {
      case 'object':
        if (Array.isArray(obj)) {
          return obj.map((c, idx) => deepTraverse(c, fn, [...path, idx]))
        }
        return Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [key, t(value, [...path, key])])
        )
      default:
        throw new Error(`Unhandled leaf ${path.join('.')} of type: ${typeof obj}`)
    }
  }
  return t
}

export default deepTraverse
