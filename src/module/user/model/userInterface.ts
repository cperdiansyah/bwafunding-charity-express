// Define interface for User document
export interface IUser {
  name: string
  username: string
  email: string
  password: string
  role: 'admin' | 'user'
  is_verified?: boolean
  createdAt?: Date
  updatedAt?: Date
}
