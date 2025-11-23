import { describe, expect, it } from 'vitest'

import { withPathParams, withQueryParams } from './utils'

describe('utils', () => {
  describe('withPathParams', () => {
    it('with correct object', () => {
      const result = withPathParams('/api/:id', { id: 123 })
      expect(result).toBe('/api/123')
    })

    it('with incorrect object 1', () => {
      const result = withPathParams('/api/:id', { id: 123, name: 'test' })
      expect(result).toBe('/api/123')
    })

    it('with incorrect object 2', () => {
      expect(() => withPathParams('/api/:id', { name: 'test' })).toThrowError(
        /Path parameter "id" not found in pathParams/
      )
    })

    it('with undefined', () => {
      const result = withPathParams('/api/:id')
      expect(result).toBe('/api/:id')
    })
  })

  describe('withQueryParams', () => {
    it('with correct object', () => {
      const result = withQueryParams('/api/123', { order: 'name', sort: 'asc' })
      expect(result).toBe('/api/123?order=name&sort=asc')
    })

    it('with undefined', () => {
      const result = withQueryParams('/api/123', undefined)
      expect(result).toBe('/api/123')
    })
  })
})
