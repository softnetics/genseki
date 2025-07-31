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
  }
  primaryFields: ['id']
  uniqueFields: [['id'], ['email']]
}

export interface UserModel {
  shape: UserModelShape
  config: UserModelConfig
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
      relationName: 'PostToTag'
      referencedModel: PostModel
      relationToFields: []
      relationFromFields: []
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

export type FullModelSchemas = {
  user: UserModel
  profile: ProfileModel
  post: PostModel
  tag: TagModel
} & {}

export const FullModelSchemas = unsanitizedModelSchemas<FullModelSchemas>(SanitizedFullModelSchemas)
