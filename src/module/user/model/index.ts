import mongoose, { Schema } from 'mongoose'
import { IUser } from './userInterface'

// Define user schema
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    username: {
      type: String,
      required: [true, 'username is required'],
      unique: true,
      validate: {
        validator: async function (username: string) {
          const user = await User.findOne({ username })
          return !user
        },
        message: 'Username already exists.',
      },
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: {
        validator: async function (email: string) {
          const user = await User.findOne({ email })
          return !user
        },
        message: 'Email already exists.',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      default: 'user',
    },
    is_verified: {
      type: Boolean,
      required: [true, 'Password is required'],
      default: false,
    },
  },
  { timestamps: true }
)
const User = mongoose.model<IUser>('User', userSchema)

export default User
