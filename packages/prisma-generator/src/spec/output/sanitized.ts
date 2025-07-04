import { DataType, Dialect, model, Relationship, Role, SchemaType } from './types'

const UserModel = model(
  {
    id: {
      type: SchemaType.COLUMN,
      dataType: DataType.INTEGER,
      dialect: Dialect.POSTGRES,
      isPrimary: true,
      isUnique: true,
      isNullable: true,
      hasDefault: true,
    },
    name: {
      type: SchemaType.COLUMN,
      dataType: DataType.STRING,
      dialect: Dialect.POSTGRES,
      isPrimary: false,
      isUnique: false,
      isNullable: false,
      hasDefault: false,
    },
    email: {
      type: SchemaType.COLUMN,
      dataType: DataType.STRING,
      dialect: Dialect.POSTGRES,
      isPrimary: false,
      isUnique: true,
      isNullable: false,
      hasDefault: false,
    },
    emailVerified: {
      type: SchemaType.COLUMN,
      dataType: DataType.BOOLEAN,
      dialect: Dialect.POSTGRES,
      isPrimary: false,
      isUnique: false,
      isNullable: false,
      hasDefault: true,
    },
    phone: {
      type: SchemaType.COLUMN,
      dataType: DataType.STRING,
      dialect: Dialect.POSTGRES,
      isPrimary: false,
      isUnique: true,
      isNullable: true,
      hasDefault: false,
    },
    phoneVerified: {
      type: SchemaType.COLUMN,
      dataType: DataType.BOOLEAN,
      dialect: Dialect.POSTGRES,
      isPrimary: false,
      isUnique: false,
      isNullable: false,
      hasDefault: true,
    },
    role: {
      type: SchemaType.COLUMN,
      dataType: DataType.STRING,
      dialect: Dialect.POSTGRES,
      isPrimary: false,
      isUnique: false,
      isNullable: false,
      hasDefault: true,
      enumValues: Object.values(Role),
    },
    profile: {
      type: SchemaType.RELATION,
      relationship: Relationship.ONE_TO_ONE,
      relatedTo: 'ProfileModel',
      isNullable: true,
    },
    posts: {
      type: SchemaType.RELATION,
      relationship: Relationship.ONE_TO_MANY,
      relatedTo: 'PostModel',
    },
  },
  {
    name: 'UserModel',
    dbModelName: 'User',
    prismaModelName: 'User',
  }
)

const ProfileModel = model(
  {
    id: {
      type: SchemaType.COLUMN,
      dataType: DataType.INTEGER,
      dialect: Dialect.POSTGRES,
      isPrimary: true,
      isUnique: true,
      isNullable: true,
      hasDefault: true,
    },
    bio: {
      type: SchemaType.COLUMN,
      dataType: DataType.STRING,
      dialect: Dialect.POSTGRES,
      isPrimary: false,
      isUnique: false,
      isNullable: true,
      hasDefault: false,
    },
    user: {
      type: SchemaType.RELATION,
      relationship: Relationship.MANY_TO_ONE,
      relatedTo: 'UserModel',
      isNullable: false,
    },
  },
  {
    name: 'ProfileModel',
    dbModelName: 'Profile',
    prismaModelName: 'Profile',
  }
)

export { ProfileModel, UserModel }
