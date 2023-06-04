import { Types } from "mongoose"

// Define interface for User document
export interface IUser {
  _id?: Types.ObjectId
  name: string
  username: string
  email: string
  password: string
  role: 'admin' | 'user'
  is_verified?: boolean
  createdAt?: Date
  updatedAt?: Date
  refresh_token?: string
}
