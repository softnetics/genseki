import { describe, expect, it } from 'vitest'

import {
  buildOrderByCondition,
  buildSearchCondition,
  createOrderByCondition,
} from './builder.utils'
import type { FieldColumnShape, FieldRelationShape, Fields } from './field'

const mockStringColumn: FieldColumnShape = {
  $client: {
    column: {
      dataType: 'STRING' as any,
    },
  },
  $server: {
    column: {
      isList: false,
      isRequired: true,
      dataType: 'STRING' as any,
    },
  },
} as any

const mockRelationField = (fields: Fields): FieldRelationShape =>
  ({
    $server: {
      relation: {
        name: 'posts',
        isList: true,
        isRequired: false,
        relationDataTypes: [] as any,
      },
    },
    fields,
  }) as any

describe('buildSearchCondition', () => {
  it('should build simple field search condition', () => {
    const fields: Fields = {
      shape: {
        name: mockStringColumn,
      },
      config: {} as any,
    }

    const result = buildSearchCondition('name', 'john', fields)

    expect(result).toEqual({
      name: {
        contains: 'john',
        mode: 'insensitive',
      },
    })
  })

  it('should build search condition from array path', () => {
    const fields: Fields = {
      shape: {
        email: mockStringColumn,
      },
      config: {} as any,
    }

    const result = buildSearchCondition(['email'], 'test@example.com', fields)

    expect(result).toEqual({
      email: {
        contains: 'test@example.com',
        mode: 'insensitive',
      },
    })
  })

  it('should build nested relation search condition', () => {
    const userFields: Fields = {
      shape: {
        name: mockStringColumn,
      },
      config: {} as any,
    }

    const postFields: Fields = {
      shape: {
        author: mockRelationField(userFields),
      },
      config: {} as any,
    }

    const result = buildSearchCondition('author.name', 'john', postFields)

    expect(result).toEqual({
      posts: {
        name: {
          contains: 'john',
          mode: 'insensitive',
        },
      },
    })
  })

  it('should build deeply nested search condition', () => {
    const countryFields: Fields = {
      shape: {
        name: mockStringColumn,
      },
      config: {} as any,
    }

    const cityFields: Fields = {
      shape: {
        country: mockRelationField(countryFields),
      },
      config: {} as any,
    }

    const userFields: Fields = {
      shape: {
        city: mockRelationField(cityFields),
      },
      config: {} as any,
    }

    const result = buildSearchCondition('city.country.name', 'USA', userFields)

    expect(result).toEqual({
      posts: {
        posts: {
          name: {
            contains: 'USA',
            mode: 'insensitive',
          },
        },
      },
    })
  })
})

describe('buildOrderByCondition', () => {
  it('should return empty object for empty path', () => {
    const fields: Fields = {
      shape: {},
      config: {} as any,
    }

    const result = buildOrderByCondition([], 'asc', fields)

    expect(result).toEqual({})
  })

  it('should build simple orderBy condition', () => {
    const fields: Fields = {
      shape: {
        createdAt: mockStringColumn,
      },
      config: {} as any,
    }

    const result = buildOrderByCondition(['createdAt'], 'desc', fields)

    expect(result).toEqual({
      createdAt: 'desc',
    })
  })

  it('should build nested relation orderBy condition', () => {
    const userFields: Fields = {
      shape: {
        name: mockStringColumn,
      },
      config: {} as any,
    }

    const postFields: Fields = {
      shape: {
        author: mockRelationField(userFields),
      },
      config: {} as any,
    }

    const result = buildOrderByCondition(['author', 'name'], 'asc', postFields)

    expect(result).toEqual({
      posts: {
        name: 'asc',
      },
    })
  })

  it('should build deeply nested orderBy condition', () => {
    const tagFields: Fields = {
      shape: {
        name: mockStringColumn,
      },
      config: {} as any,
    }

    const categoryFields: Fields = {
      shape: {
        tags: mockRelationField(tagFields),
      },
      config: {} as any,
    }

    const postFields: Fields = {
      shape: {
        category: mockRelationField(categoryFields),
      },
      config: {} as any,
    }

    const result = buildOrderByCondition(['category', 'tags', 'name'], 'desc', postFields)

    expect(result).toEqual({
      posts: {
        posts: {
          name: 'desc',
        },
      },
    })
  })
})

describe('createOrderByCondition', () => {
  const mockModel = {
    shape: {
      columns: {
        id: { name: 'id' },
        name: { name: 'name' },
        createdAt: { name: 'createdAt' },
      },
      primaryFields: ['id'],
    },
    config: {
      prismaModelName: 'User',
    },
  }

  const mockFields: Fields = {
    shape: {
      id: mockStringColumn,
      name: mockStringColumn,
      createdAt: mockStringColumn,
    },
    config: {} as any,
  }

  it('should return default orderBy when no sortPath provided', () => {
    const result = createOrderByCondition(undefined, undefined, undefined, mockModel, mockFields)

    expect(result).toEqual({
      id: 'asc',
    })
  })

  it('should use configured default sortBy when no sortPath provided', () => {
    const allowedSortPaths = {
      sortBy: [['createdAt', 'desc'], ['name']],
    }

    const result = createOrderByCondition(
      undefined,
      undefined,
      allowedSortPaths,
      mockModel,
      mockFields
    )

    expect(result).toEqual([{ createdAt: 'desc' }, { name: 'asc' }])
  })

  it('should build orderBy for simple column', () => {
    const result = createOrderByCondition('name', 'desc', undefined, mockModel, mockFields)

    expect(result).toEqual({
      name: 'desc',
    })
  })

  it('should default to asc when no sortOrder provided', () => {
    const result = createOrderByCondition('name', undefined, undefined, mockModel, mockFields)

    expect(result).toEqual({
      name: 'asc',
    })
  })

  it('should build orderBy for nested relation path', () => {
    const authorFields: Fields = {
      shape: {
        name: mockStringColumn,
      },
      config: {} as any,
    }

    const postFields: Fields = {
      shape: {
        author: mockRelationField(authorFields),
      },
      config: {} as any,
    }

    const result = createOrderByCondition('author.name', 'desc', undefined, mockModel, postFields)

    expect(result).toEqual({
      posts: {
        name: 'desc',
      },
    })
  })

  it('should respect allowed sort paths when provided', () => {
    const allowedSortPaths = {
      sortBy: [['name'], ['createdAt', 'desc']],
    }

    const result = createOrderByCondition('name', 'desc', allowedSortPaths, mockModel, mockFields)

    expect(result).toEqual({
      name: 'desc',
    })
  })

  it('should fallback to primary field when sort path not allowed', () => {
    const allowedSortPaths = {
      sortBy: [['name']],
    }

    const result = createOrderByCondition(
      'email', // Not in allowed paths
      'desc',
      allowedSortPaths,
      mockModel,
      mockFields
    )

    expect(result).toEqual({
      id: 'desc',
    })
  })

  it('should fallback to primary field when column does not exist', () => {
    const result = createOrderByCondition('nonexistent', 'desc', undefined, mockModel, mockFields)

    expect(result).toEqual({
      id: 'desc',
    })
  })

  it('should handle nested path in allowed sortBy configuration', () => {
    const authorFields: Fields = {
      shape: {
        name: mockStringColumn,
      },
      config: {} as any,
    }

    const postFields: Fields = {
      shape: {
        author: mockRelationField(authorFields),
      },
      config: {} as any,
    }

    const allowedSortPaths = {
      sortBy: [['author.name', 'asc']],
    }

    const result = createOrderByCondition(
      undefined,
      undefined,
      allowedSortPaths,
      mockModel,
      postFields
    )

    expect(result).toEqual([
      {
        posts: {
          name: 'asc',
        },
      },
    ])
  })
})
