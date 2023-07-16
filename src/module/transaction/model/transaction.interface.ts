import { Types } from 'mongoose'

export interface ITransaction {
  user_id?: Types.ObjectId
  transaction_type?: 'campaign' | 'sedekah-subuh'
  campaign_id?: Types.ObjectId
  status?: 'pending' | 'PAID' | 'failure' | 'cancel' | 'expire' | 'refund'
  quantity?: number
  amount?: number
  response_midtrans?: IResponseMidtrans | null
  createdAt?: Date
  updatedAt?: Date
}

export interface IResponseMidtrans {
  token: string
  redirect_url: string
}
