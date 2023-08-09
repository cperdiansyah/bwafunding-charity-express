import { Types } from 'mongoose'

export type statusExchange = 'pending' | 'accept' | 'rejected'

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
  timestamp?: number
  history_type?: historyType
}

export interface IExchange {
  _id?: Types.ObjectId
  user_id?: Types.ObjectId | null
  reward_id?: Types.ObjectId | null
  timestamp?: number
  status: statusExchange
}

export type historyType = 'add' | 'subtract'
