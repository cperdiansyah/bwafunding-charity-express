import { Types } from 'mongoose'

export type statusTransaction =
  | 'pending'
  | 'settlement'
  | 'deny'
  | 'cancel'
  | 'failure'
  | 'expire'
  | 'refund'

export interface ITransaction {
  user_id?: Types.ObjectId
  transaction_type: 'campaign' | 'sedekah-subuh'
  campaign_id?: Types.ObjectId
  status?: statusTransaction
  quantity?: number
  amount?: number
  response_midtrans?: IResponseMidtrans | any
  createdAt?: Date
  updatedAt?: Date
}

export interface IResponseMidtrans {
  token: string
  redirect_url: string
}
