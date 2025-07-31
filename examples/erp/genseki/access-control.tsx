import { createAccessControl } from '@genseki/plugins'

export const accessControl = createAccessControl({
  statements: {
    userManagement: {
      staff: ['create', 'read', 'update', 'delete'],
      client: ['create', 'read', 'update', 'delete'],
    },
  },
  roles: {
    admin: {
      userManagement: {
        staff: ['create'],
      },
    },
    client: {
      userManagement: {
        staff: ['read'],
      },
    },
  },
})
