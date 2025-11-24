import { describe, expect, it } from 'vitest'

import { createAccessControl } from '.'

describe('admin', () => {
  describe('AccessControl', () => {
    const accessControl = createAccessControl({
      statements: {
        userManagement: {
          staff: ['create', 'read', 'update', 'delete'],
          client: ['create', 'read', 'update', 'delete'],
        },
        inventoryManagement: {
          product: ['create', 'read', 'update', 'delete'],
          category: ['create', 'read', 'update', 'delete'],
        },
      },
      roles: {
        admin: {
          userManagement: {
            staff: ['create', 'read', 'update', 'delete'],
            client: ['create', 'read', 'update', 'delete'],
          },
          inventoryManagement: {
            category: ['create', 'read'],
          },
        },
        client: {
          userManagement: {
            staff: ['read'],
          },
          inventoryManagement: {
            product: ['read'],
            category: ['read'],
          },
        },
      },
    })

    it('should successfully create access control instance', () => {
      expect(accessControl).toBeDefined()
    })

    it('should return hasPermission to true', () => {
      const hasPermission = accessControl.hasPermission('admin', 'userManagement.staff.create')
      expect(hasPermission).toBe(true)
    })

    it('should return hasPermission to false', () => {
      const hasPermission = accessControl.hasPermission('client', 'userManagement.staff.create')
      expect(hasPermission).toBe(false)
    })

    it('should return hasPermission to false if role does not exist', () => {
      const hasPermission = accessControl.hasPermission('unknown', 'userManagement.staff.create')
      expect(hasPermission).toBe(false)
    })
  })
})
