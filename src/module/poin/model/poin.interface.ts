import { Types } from 'mongoose'

// Define interface for User document

export interface IPoin {
  _id?: Types.ObjectId
  id_user?: Types.ObjectId | null
  value?: number
  createdAt?: Date
  updatedAt?: Date
}
export interface IPoinHistory {
  _id?: Types.ObjectId
  id_point?: Types.ObjectId | null
  value?: number
  timestamp?: Date | number
  history_type?: historyType
}

export type historyType = 'add' | 'subtract'
