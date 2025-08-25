import { type DataType, type SchemaType, unsanitizedModelSchemas } from '@genseki/react'

import { SanitizedFullModelSchemas } from './sanitized'

export interface UserModelConfig {
  name: 'UserModel'
  dbModelName: 'User'
  prismaModelName: 'user'
}

export interface UserModelShape {
  columns: {
    id: {
      schema: typeof SchemaType.COLUMN
      name: 'id'
      isId: true
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.STRING
    }
    name: {
      schema: typeof SchemaType.COLUMN
      name: 'name'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    image: {
      schema: typeof SchemaType.COLUMN
      name: 'image'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    email: {
      schema: typeof SchemaType.COLUMN
      name: 'email'
      isId: false
      isList: false
      isUnique: true
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    emailVerified: {
      schema: typeof SchemaType.COLUMN
      name: 'emailVerified'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: true
      dataType: typeof DataType.BOOLEAN
    }
    roles: {
      schema: typeof SchemaType.COLUMN
      name: 'roles'
      isId: false
      isList: true
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    banned: {
      schema: typeof SchemaType.COLUMN
      name: 'banned'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.BOOLEAN
    }
    bannedReason: {
      schema: typeof SchemaType.COLUMN
      name: 'bannedReason'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    bannedAt: {
      schema: typeof SchemaType.COLUMN
      name: 'bannedAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.DATETIME
    }
    bannedExpiredAt: {
      schema: typeof SchemaType.COLUMN
      name: 'bannedExpiredAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.DATETIME
    }
    createdAt: {
      schema: typeof SchemaType.COLUMN
      name: 'createdAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.DATETIME
    }
    updatedAt: {
      schema: typeof SchemaType.COLUMN
      name: 'updatedAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.DATETIME
    }
    staffInfoId: {
      schema: typeof SchemaType.COLUMN
      name: 'staffInfoId'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: true
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
  }
  relations: {
    posts: {
      schema: typeof SchemaType.RELATION
      name: 'posts'
      isId: false
      isList: true
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      relationName: 'PostToUser'
      referencedModel: PostModel
      relationToFields: []
      relationFromFields: []
      relationDataTypes: [typeof DataType.STRING]
    }
    profile: {
      schema: typeof SchemaType.RELATION
      name: 'profile'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      relationName: 'ProfileToUser'
      referencedModel: ProfileModel
      relationToFields: []
      relationFromFields: []
      relationDataTypes: [typeof DataType.STRING]
    }
    comments: {
      schema: typeof SchemaType.RELATION
      name: 'comments'
      isId: false
      isList: true
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      relationName: 'CommentToUser'
      referencedModel: CommentModel
      relationToFields: []
      relationFromFields: []
      relationDataTypes: [typeof DataType.STRING]
    }
    accounts: {
      schema: typeof SchemaType.RELATION
      name: 'accounts'
      isId: false
      isList: true
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      relationName: 'AccountToUser'
      referencedModel: AccountModel
      relationToFields: []
      relationFromFields: []
      relationDataTypes: [typeof DataType.STRING]
    }
    sessions: {
      schema: typeof SchemaType.RELATION
      name: 'sessions'
      isId: false
      isList: true
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      relationName: 'SessionToUser'
      referencedModel: SessionModel
      relationToFields: []
      relationFromFields: []
      relationDataTypes: [typeof DataType.STRING]
    }
    verifications: {
      schema: typeof SchemaType.RELATION
      name: 'verifications'
      isId: false
      isList: true
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      relationName: 'UserToVerification'
      referencedModel: VerificationModel
      relationToFields: []
      relationFromFields: []
      relationDataTypes: [typeof DataType.STRING]
    }
    staffInfo: {
      schema: typeof SchemaType.RELATION
      name: 'staffInfo'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      relationName: 'StaffInfoToUser'
      referencedModel: StaffInfoModel
      relationToFields: ['id']
      relationFromFields: ['id']
      relationDataTypes: [typeof DataType.STRING]
    }
  }
  primaryFields: ['id']
  uniqueFields: [['id'], ['email']]
}

export interface UserModel {
  shape: UserModelShape
  config: UserModelConfig
}

export interface AccountModelConfig {
  name: 'AccountModel'
  dbModelName: 'Account'
  prismaModelName: 'account'
}

export interface AccountModelShape {
  columns: {
    id: {
      schema: typeof SchemaType.COLUMN
      name: 'id'
      isId: true
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.STRING
    }
    userId: {
      schema: typeof SchemaType.COLUMN
      name: 'userId'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: true
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    accountId: {
      schema: typeof SchemaType.COLUMN
      name: 'accountId'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    provider: {
      schema: typeof SchemaType.COLUMN
      name: 'provider'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    idToken: {
      schema: typeof SchemaType.COLUMN
      name: 'idToken'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    accessToken: {
      schema: typeof SchemaType.COLUMN
      name: 'accessToken'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    refreshToken: {
      schema: typeof SchemaType.COLUMN
      name: 'refreshToken'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    accessTokenExpiredAt: {
      schema: typeof SchemaType.COLUMN
      name: 'accessTokenExpiredAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.DATETIME
    }
    refreshTokenExpiredAt: {
      schema: typeof SchemaType.COLUMN
      name: 'refreshTokenExpiredAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.DATETIME
    }
    scope: {
      schema: typeof SchemaType.COLUMN
      name: 'scope'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    password: {
      schema: typeof SchemaType.COLUMN
      name: 'password'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    createdAt: {
      schema: typeof SchemaType.COLUMN
      name: 'createdAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.DATETIME
    }
    updatedAt: {
      schema: typeof SchemaType.COLUMN
      name: 'updatedAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.DATETIME
    }
  }
  relations: {
    user: {
      schema: typeof SchemaType.RELATION
      name: 'user'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      relationName: 'AccountToUser'
      referencedModel: UserModel
      relationToFields: ['id']
      relationFromFields: ['id']
      relationDataTypes: [typeof DataType.STRING]
    }
  }
  primaryFields: ['id']
  uniqueFields: [['id'], ['userId', 'provider']]
}

export interface AccountModel {
  shape: AccountModelShape
  config: AccountModelConfig
}

export interface SessionModelConfig {
  name: 'SessionModel'
  dbModelName: 'Session'
  prismaModelName: 'session'
}

export interface SessionModelShape {
  columns: {
    id: {
      schema: typeof SchemaType.COLUMN
      name: 'id'
      isId: true
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.STRING
    }
    userId: {
      schema: typeof SchemaType.COLUMN
      name: 'userId'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: true
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    token: {
      schema: typeof SchemaType.COLUMN
      name: 'token'
      isId: false
      isList: false
      isUnique: true
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    ipAddress: {
      schema: typeof SchemaType.COLUMN
      name: 'ipAddress'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    userAgent: {
      schema: typeof SchemaType.COLUMN
      name: 'userAgent'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    expiredAt: {
      schema: typeof SchemaType.COLUMN
      name: 'expiredAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.DATETIME
    }
    createdAt: {
      schema: typeof SchemaType.COLUMN
      name: 'createdAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.DATETIME
    }
    updatedAt: {
      schema: typeof SchemaType.COLUMN
      name: 'updatedAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.DATETIME
    }
  }
  relations: {
    user: {
      schema: typeof SchemaType.RELATION
      name: 'user'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      relationName: 'SessionToUser'
      referencedModel: UserModel
      relationToFields: ['id']
      relationFromFields: ['id']
      relationDataTypes: [typeof DataType.STRING]
    }
  }
  primaryFields: ['id']
  uniqueFields: [['id'], ['token']]
}

export interface SessionModel {
  shape: SessionModelShape
  config: SessionModelConfig
}

export interface VerificationModelConfig {
  name: 'VerificationModel'
  dbModelName: 'Verification'
  prismaModelName: 'verification'
}

export interface VerificationModelShape {
  columns: {
    id: {
      schema: typeof SchemaType.COLUMN
      name: 'id'
      isId: true
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.STRING
    }
    userId: {
      schema: typeof SchemaType.COLUMN
      name: 'userId'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: true
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    value: {
      schema: typeof SchemaType.COLUMN
      name: 'value'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    identifier: {
      schema: typeof SchemaType.COLUMN
      name: 'identifier'
      isId: false
      isList: false
      isUnique: true
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    expiredAt: {
      schema: typeof SchemaType.COLUMN
      name: 'expiredAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.DATETIME
    }
    createdAt: {
      schema: typeof SchemaType.COLUMN
      name: 'createdAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.DATETIME
    }
    updatedAt: {
      schema: typeof SchemaType.COLUMN
      name: 'updatedAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.DATETIME
    }
  }
  relations: {
    user: {
      schema: typeof SchemaType.RELATION
      name: 'user'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      relationName: 'UserToVerification'
      referencedModel: UserModel
      relationToFields: ['id']
      relationFromFields: ['id']
      relationDataTypes: [typeof DataType.STRING]
    }
  }
  primaryFields: ['id']
  uniqueFields: [['id'], ['identifier']]
}

export interface VerificationModel {
  shape: VerificationModelShape
  config: VerificationModelConfig
}

export interface ProfileModelConfig {
  name: 'ProfileModel'
  dbModelName: 'Profile'
  prismaModelName: 'profile'
}

export interface ProfileModelShape {
  columns: {
    id: {
      schema: typeof SchemaType.COLUMN
      name: 'id'
      isId: true
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.STRING
    }
    bio: {
      schema: typeof SchemaType.COLUMN
      name: 'bio'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    userId: {
      schema: typeof SchemaType.COLUMN
      name: 'userId'
      isId: false
      isList: false
      isUnique: true
      isReadOnly: true
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    createdAt: {
      schema: typeof SchemaType.COLUMN
      name: 'createdAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.DATETIME
    }
    updatedAt: {
      schema: typeof SchemaType.COLUMN
      name: 'updatedAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.DATETIME
    }
  }
  relations: {
    user: {
      schema: typeof SchemaType.RELATION
      name: 'user'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      relationName: 'ProfileToUser'
      referencedModel: UserModel
      relationToFields: ['id']
      relationFromFields: ['id']
      relationDataTypes: [typeof DataType.STRING]
    }
  }
  primaryFields: ['id']
  uniqueFields: [['id'], ['userId']]
}

export interface ProfileModel {
  shape: ProfileModelShape
  config: ProfileModelConfig
}

export interface PostModelConfig {
  name: 'PostModel'
  dbModelName: 'Post'
  prismaModelName: 'post'
}

export interface PostModelShape {
  columns: {
    id: {
      schema: typeof SchemaType.COLUMN
      name: 'id'
      isId: true
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.STRING
    }
    title: {
      schema: typeof SchemaType.COLUMN
      name: 'title'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    content: {
      schema: typeof SchemaType.COLUMN
      name: 'content'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.JSON
    }
    published: {
      schema: typeof SchemaType.COLUMN
      name: 'published'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.BOOLEAN
    }
    authorId: {
      schema: typeof SchemaType.COLUMN
      name: 'authorId'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: true
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    createdAt: {
      schema: typeof SchemaType.COLUMN
      name: 'createdAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.DATETIME
    }
    updatedAt: {
      schema: typeof SchemaType.COLUMN
      name: 'updatedAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.DATETIME
    }
  }
  relations: {
    author: {
      schema: typeof SchemaType.RELATION
      name: 'author'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      relationName: 'PostToUser'
      referencedModel: UserModel
      relationToFields: ['id']
      relationFromFields: ['id']
      relationDataTypes: [typeof DataType.STRING]
    }
    comments: {
      schema: typeof SchemaType.RELATION
      name: 'comments'
      isId: false
      isList: true
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      relationName: 'CommentToPost'
      referencedModel: CommentModel
      relationToFields: []
      relationFromFields: []
      relationDataTypes: [typeof DataType.STRING]
    }
    tags: {
      schema: typeof SchemaType.RELATION
      name: 'tags'
      isId: false
      isList: true
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      relationName: 'PostToTag'
      referencedModel: TagModel
      relationToFields: []
      relationFromFields: []
      relationDataTypes: [typeof DataType.STRING]
    }
  }
  primaryFields: ['id']
  uniqueFields: [['id']]
}

export interface PostModel {
  shape: PostModelShape
  config: PostModelConfig
}

export interface TagModelConfig {
  name: 'TagModel'
  dbModelName: 'Tag'
  prismaModelName: 'tag'
}

export interface TagModelShape {
  columns: {
    id: {
      schema: typeof SchemaType.COLUMN
      name: 'id'
      isId: true
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.STRING
    }
    name: {
      schema: typeof SchemaType.COLUMN
      name: 'name'
      isId: false
      isList: false
      isUnique: true
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    createdAt: {
      schema: typeof SchemaType.COLUMN
      name: 'createdAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.DATETIME
    }
    updatedAt: {
      schema: typeof SchemaType.COLUMN
      name: 'updatedAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.DATETIME
    }
    postId: {
      schema: typeof SchemaType.COLUMN
      name: 'postId'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: true
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
  }
  relations: {
    Post: {
      schema: typeof SchemaType.RELATION
      name: 'Post'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      relationName: 'PostToTag'
      referencedModel: PostModel
      relationToFields: ['id']
      relationFromFields: ['id']
      relationDataTypes: [typeof DataType.STRING]
    }
  }
  primaryFields: ['id']
  uniqueFields: [['id'], ['name']]
}

export interface TagModel {
  shape: TagModelShape
  config: TagModelConfig
}

export interface CommentModelConfig {
  name: 'CommentModel'
  dbModelName: 'Comment'
  prismaModelName: 'comment'
}

export interface CommentModelShape {
  columns: {
    id: {
      schema: typeof SchemaType.COLUMN
      name: 'id'
      isId: true
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.STRING
    }
    content: {
      schema: typeof SchemaType.COLUMN
      name: 'content'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    postId: {
      schema: typeof SchemaType.COLUMN
      name: 'postId'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: true
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    authorId: {
      schema: typeof SchemaType.COLUMN
      name: 'authorId'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: true
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    createdAt: {
      schema: typeof SchemaType.COLUMN
      name: 'createdAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.DATETIME
    }
    updatedAt: {
      schema: typeof SchemaType.COLUMN
      name: 'updatedAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.DATETIME
    }
  }
  relations: {
    post: {
      schema: typeof SchemaType.RELATION
      name: 'post'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      relationName: 'CommentToPost'
      referencedModel: PostModel
      relationToFields: ['id']
      relationFromFields: ['id']
      relationDataTypes: [typeof DataType.STRING]
    }
    author: {
      schema: typeof SchemaType.RELATION
      name: 'author'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      relationName: 'CommentToUser'
      referencedModel: UserModel
      relationToFields: ['id']
      relationFromFields: ['id']
      relationDataTypes: [typeof DataType.STRING]
    }
  }
  primaryFields: ['id']
  uniqueFields: [['id']]
}

export interface CommentModel {
  shape: CommentModelShape
  config: CommentModelConfig
}

export interface StaffInfoModelConfig {
  name: 'StaffInfoModel'
  dbModelName: 'StaffInfo'
  prismaModelName: 'staffInfo'
}

export interface StaffInfoModelShape {
  columns: {
    id: {
      schema: typeof SchemaType.COLUMN
      name: 'id'
      isId: true
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.STRING
    }
    position: {
      schema: typeof SchemaType.COLUMN
      name: 'position'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    department: {
      schema: typeof SchemaType.COLUMN
      name: 'department'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    createdAt: {
      schema: typeof SchemaType.COLUMN
      name: 'createdAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.DATETIME
    }
    updatedAt: {
      schema: typeof SchemaType.COLUMN
      name: 'updatedAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.DATETIME
    }
  }
  relations: {
    User: {
      schema: typeof SchemaType.RELATION
      name: 'User'
      isId: false
      isList: true
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      relationName: 'StaffInfoToUser'
      referencedModel: UserModel
      relationToFields: []
      relationFromFields: []
      relationDataTypes: [typeof DataType.STRING]
    }
  }
  primaryFields: ['id']
  uniqueFields: [['id']]
}

export interface StaffInfoModel {
  shape: StaffInfoModelShape
  config: StaffInfoModelConfig
}

export type FullModelSchemas = {
  user: UserModel
  account: AccountModel
  session: SessionModel
  verification: VerificationModel
  profile: ProfileModel
  post: PostModel
  tag: TagModel
  comment: CommentModel
  staffInfo: StaffInfoModel
} & {}

export const FullModelSchemas = unsanitizedModelSchemas<FullModelSchemas>(SanitizedFullModelSchemas)
