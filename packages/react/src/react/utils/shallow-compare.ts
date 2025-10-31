export function shallowCompare(prevProps: Record<string, any>, nextProps: Record<string, any>) {
  // Check if the number of keys is different
  const prevKeys = Object.keys(prevProps)
  const nextKeys = Object.keys(nextProps)

  if (prevKeys.length !== nextKeys.length) {
    return false // Different number of props, so they are not shallowly equal
  }

  // Iterate over the keys and compare values
  for (let i = 0; i < prevKeys.length; i++) {
    const key = prevKeys[i]
    // If a key is missing in nextProps or its value is not strictly equal, return false
    if (!(key in nextProps) || prevProps[key] !== nextProps[key]) {
      return false
    }
  }

  return true // All keys and values are shallowly equal
}
