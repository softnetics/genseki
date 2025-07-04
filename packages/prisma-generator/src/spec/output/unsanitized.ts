import type { DataType, Dialect, Relationship, SchemaType } from './types'

interface UserModelConfig {
  name: 'UserModel'
  dbModelName: 'User'
  prismaModelName: 'User'
}

interface UserModelShape {
  id: {
    type: typeof SchemaType.COLUMN
    dataType: typeof DataType.INTEGER
    dialect: typeof Dialect.POSTGRES
    isPrimary: true
    isUnique: true
    isNullable: true
    hasDefault: true
  }
  name: {
    type: typeof SchemaType.COLUMN
    dataType: typeof DataType.STRING
    dialect: typeof Dialect.POSTGRES
    isPrimary: false
    isUnique: false
    isNullable: false
    hasDefault: false
  }
  email: {
    type: typeof SchemaType.COLUMN
    dataType: typeof DataType.STRING
    dialect: typeof Dialect.POSTGRES
    isPrimary: false
    isUnique: true
    isNullable: false
    hasDefault: false
  }
  emailVerified: {
    type: typeof SchemaType.COLUMN
    dataType: typeof DataType.BOOLEAN
    dialect: typeof Dialect.POSTGRES
    isPrimary: false
    isUnique: false
    isNullable: false
    hasDefault: true
  }
  phone: {
    type: typeof SchemaType.COLUMN
    dataType: typeof DataType.STRING
    dialect: typeof Dialect.POSTGRES
    isPrimary: false
    isUnique: true
    isNullable: true
    hasDefault: false
  }
  phoneVerified: {
    type: typeof SchemaType.COLUMN
    dataType: typeof DataType.BOOLEAN
    dialect: typeof Dialect.POSTGRES
    isPrimary: false
    isUnique: false
    isNullable: false
    hasDefault: true
  }
  role: {
    type: typeof SchemaType.COLUMN
    dataType: typeof DataType.STRING
    dialect: typeof Dialect.POSTGRES
    isPrimary: false
    isUnique: false
    isNullable: false
    hasDefault: false
  }
  profile: {
    type: typeof SchemaType.RELATION
    relationship: typeof Relationship.ONE_TO_ONE
    relatedTo: ProfileModel
    isNullable: true
    relationshipName: 'user'
  }
  posts: {
    type: typeof SchemaType.RELATION
    relationship: typeof Relationship.ONE_TO_MANY
    relatedTo: PostModel
    isNullable: true
  }
}

export interface UserModel {
  config: UserModelConfig
  shape: UserModelShape
}

interface ProfileModelConfig {
  name: 'ProfileModel'
  dbModelName: 'Profile'
  prismaModelName: 'Profile'
}

interface ProfileModelShape {
  id: {
    type: typeof SchemaType.COLUMN
    dataType: typeof DataType.INTEGER
    dialect: typeof Dialect.POSTGRES
    isPrimary: true
    isUnique: true
    isNullable: true
    hasDefault: true
  }
  bio: {
    type: typeof SchemaType.COLUMN
    dataType: typeof DataType.STRING
    dialect: typeof Dialect.POSTGRES
    isPrimary: false
    isUnique: false
    isNullable: true
    hasDefault: false
  }
  user: {
    type: typeof SchemaType.RELATION
    relationship: typeof Relationship.MANY_TO_ONE
    relatedTo: UserModel
    isNullable: false
  }
}

interface ProfileModel {
  config: ProfileModelConfig
  shape: ProfileModelShape
}

interface PostModelConfig {
  name: 'PostModel'
  dbModelName: 'Post'
  prismaModelName: 'Post'
}

interface PostModelShape {
  id: {
    type: typeof SchemaType.COLUMN
    dataType: typeof DataType.INTEGER
    dialect: typeof Dialect.POSTGRES
    isPrimary: true
    isUnique: true
    isNullable: true
    hasDefault: true
  }
  title: {
    type: typeof SchemaType.COLUMN
    dataType: typeof DataType.STRING
    dialect: typeof Dialect.POSTGRES
    isPrimary: false
    isUnique: false
    isNullable: false
    hasDefault: false
  }
  content: {
    type: typeof SchemaType.COLUMN
    dataType: typeof DataType.STRING
    dialect: typeof Dialect.POSTGRES
    isPrimary: false
    isUnique: false
    isNullable: true
    hasDefault: false
  }
  authorId: {
    type: typeof SchemaType.COLUMN
    dataType: typeof DataType.INTEGER
    dialect: typeof Dialect.POSTGRES
    isPrimary: false
    isUnique: false
    isNullable: false
    hasDefault: false
  }
  author: {
    type: typeof SchemaType.RELATION
    relationship: typeof Relationship.MANY_TO_ONE
    relatedTo: UserModel
    isNullable: false
  }
}

export interface PostModel {
  config: PostModelConfig
  shape: PostModelShape
}

export type Schema = {
  UserModel: UserModel
  ProfileModel: ProfileModel
  PostModel: PostModel
}
