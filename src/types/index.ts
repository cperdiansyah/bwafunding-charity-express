import { Types } from 'mongoose'
import { IUser } from '../module/user/model/userInterface.js'

export interface ITokenPayload {
  id?: Types.ObjectId
  name?: string
  email?: string
  role: IUser['role']
  is_verified: boolean | undefined
  isAuthenticated: boolean
}

export interface IAnonymousToken {
  role: string
  isAuthenticated: boolean
  is_verified: boolean
}
