import { unsanitizeSchema } from './helper'
import { ProfileModel, UserModel } from './sanitized'

const schema = unsanitizeSchema({
  UserModel,
  ProfileModel,
})
