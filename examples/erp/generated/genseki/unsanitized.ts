import { type DataType, type SchemaType } from '@genseki/react'

export interface UserModelConfig {
  name: 'UserModel'
  dbModelName: 'User'
  prismaModelName: 'user'
  primaryFields: ['id']
  uniqueFields: [['id'], ['email']]
}

export interface UserModelShape {
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
  email: {
    schema: typeof SchemaType.COLUMN
    name: 'email'
    isId: false
    isList: false
    isUnique: true
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
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
    relationDataTypes: []
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
    relationDataTypes: []
  }
  profiles: {
    schema: typeof SchemaType.RELATION
    name: 'profiles'
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
    relationDataTypes: []
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

export interface UserModel {
  shape: UserModelShape
  config: UserModelConfig
}

export interface ProfileModelConfig {
  name: 'ProfileModel'
  dbModelName: 'Profile'
  prismaModelName: 'profile'
  primaryFields: ['id']
  uniqueFields: [['id'], ['userId']]
}

export interface ProfileModelShape {
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

export interface ProfileModel {
  shape: ProfileModelShape
  config: ProfileModelConfig
}

export interface PostModelConfig {
  name: 'PostModel'
  dbModelName: 'Post'
  prismaModelName: 'post'
  primaryFields: ['id']
  uniqueFields: [['id']]
}

export interface PostModelShape {
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
    isRequired: false
    hasDefaultValue: false
    dataType: typeof DataType.STRING
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
    relationDataTypes: []
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

export interface PostModel {
  shape: PostModelShape
  config: PostModelConfig
}

export interface CommentModelConfig {
  name: 'CommentModel'
  dbModelName: 'Comment'
  prismaModelName: 'comment'
  primaryFields: ['id']
  uniqueFields: [['id']]
}

export interface CommentModelShape {
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

export interface CommentModel {
  shape: CommentModelShape
  config: CommentModelConfig
}

export interface FullModelSchemas {
  user: UserModel
  profile: ProfileModel
  post: PostModel
  comment: CommentModel
}
