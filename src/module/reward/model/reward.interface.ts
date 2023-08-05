import { Types } from 'mongoose'

// Define interface for User document

export interface IReward {
  _id?: Types.ObjectId
  name: string
  price: number
  createdAt?: Date
  updatedAt?: Date
}

export interface IRewardHistory {
  _id?: Types.ObjectId
  id_reward?: Types.ObjectId | null
  id_user?: Types.ObjectId | null
  timestamp?: number
  createdAt?: Date
  updatedAt?: Date
}
