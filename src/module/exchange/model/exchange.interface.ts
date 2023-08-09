import { Types } from 'mongoose'

export type statusExchange = 'pending' | 'accept' | 'rejected'

export interface IExchange {
  _id?: Types.ObjectId
  user_id?: Types.ObjectId | null
  reward_id?: Types.ObjectId | null
  timestamp?: number
  status: statusExchange
}

