export function isEmptyObject(obj: any): boolean {
  return (
    obj != null && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length === 0
  )
}

export function sortObjectDeep(obj: any): any {
  if (obj == null || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj
  }

  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = sortObjectDeep(obj[key])
      return result
    }, {} as any)
}

export function normalizeObject(payload?: any): any {
  if (!payload) return undefined

  const filtered = Object.entries(payload).reduce((acc, [key, value]) => {
    if (value != null && !isEmptyObject(value)) {
      acc[key] = sortObjectDeep(value)
    }
    return acc
  }, {} as any)

  return Object.keys(filtered).length > 0 ? filtered : undefined
}
