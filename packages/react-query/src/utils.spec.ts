import { describe, expect, it } from 'vitest'

import { isEmptyObject, normalizeObject, sortObjectDeep } from './utils'

describe('isEmptyObject', () => {
  it('should return true for empty object', () => {
    expect(isEmptyObject({})).toBe(true)
  })

  it('should return false for object with properties', () => {
    expect(isEmptyObject({ id: 1 })).toBe(false)
  })

  it('should return false for null', () => {
    expect(isEmptyObject(null)).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(isEmptyObject(undefined)).toBe(false)
  })

  it('should return false for arrays', () => {
    expect(isEmptyObject([])).toBe(false)
    expect(isEmptyObject([1, 2, 3])).toBe(false)
  })

  it('should return false for primitives', () => {
    expect(isEmptyObject('string')).toBe(false)
    expect(isEmptyObject(42)).toBe(false)
    expect(isEmptyObject(true)).toBe(false)
  })
})

describe('sortObjectDeep', () => {
  it('should sort object keys alphabetically', () => {
    const input = { z: 1, a: 2, m: 3 }
    const expected = { a: 2, m: 3, z: 1 }
    expect(sortObjectDeep(input)).toEqual(expected)
  })

  it('should sort nested objects recursively', () => {
    const input = {
      z: { y: 1, x: 2 },
      a: { c: 3, b: 4 },
    }
    const expected = {
      a: { b: 4, c: 3 },
      z: { x: 2, y: 1 },
    }
    expect(sortObjectDeep(input)).toEqual(expected)
  })

  it('should handle arrays without sorting', () => {
    const input = { items: [3, 1, 2] }
    const expected = { items: [3, 1, 2] }
    expect(sortObjectDeep(input)).toEqual(expected)
  })

  it('should handle primitives', () => {
    expect(sortObjectDeep(null)).toBe(null)
    expect(sortObjectDeep(undefined)).toBe(undefined)
    expect(sortObjectDeep(42)).toBe(42)
    expect(sortObjectDeep('string')).toBe('string')
  })

  it('should handle deeply nested mixed structures', () => {
    const input = {
      z: { nested: { b: 1, a: 2 } },
      a: [1, 2, 3],
      m: 'string',
    }
    const expected = {
      a: [1, 2, 3],
      m: 'string',
      z: { nested: { a: 2, b: 1 } },
    }
    expect(sortObjectDeep(input)).toEqual(expected)
  })

  it('should maintain object references for primitives', () => {
    const obj = { value: 42 }
    expect(sortObjectDeep(obj)).toEqual({ value: 42 })
  })
})

describe('normalizeObject', () => {
  it('should return undefined for falsy inputs', () => {
    expect(normalizeObject()).toBe(undefined)
    expect(normalizeObject(null)).toBe(undefined)
    expect(normalizeObject(undefined)).toBe(undefined)
    expect(normalizeObject(false)).toBe(undefined)
  })

  it('should return undefined when all fields are empty', () => {
    const payload = {
      query: {},
      pathParams: {},
    }
    expect(normalizeObject(payload)).toBe(undefined)
  })

  it('should filter and sort non-empty objects', () => {
    const payload = {
      query: { z: 1, a: 2 },
      pathParams: { id: '123' },
    }
    const expected = {
      pathParams: { id: '123' },
      query: { a: 2, z: 1 },
    }
    expect(normalizeObject(payload)).toEqual(expected)
  })

  it('should exclude empty objects while keeping non-empty ones', () => {
    const payload = {
      query: { name: 'John' },
      pathParams: {},
    }
    const expected = {
      query: { name: 'John' },
    }
    expect(normalizeObject(payload)).toEqual(expected)
  })

  it('should handle nested objects in query and pathParams', () => {
    const payload = {
      query: {
        filter: { z: 'last', a: 'first' },
        sort: 'name',
      },
      pathParams: {
        nested: { b: 2, a: 1 },
      },
    }
    const expected = {
      pathParams: {
        nested: { a: 1, b: 2 },
      },
      query: {
        filter: { a: 'first', z: 'last' },
        sort: 'name',
      },
    }
    expect(normalizeObject(payload)).toEqual(expected)
  })

  it('should handle null and undefined values in fields', () => {
    const payload = {
      query: null,
      pathParams: undefined,
    }
    expect(normalizeObject(payload)).toBe(undefined)
  })
})
