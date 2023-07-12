import { Types } from 'mongoose'

export interface IPaymentCampaign {
  id_user: Types.ObjectId
  id_charity?: Types.ObjectId
  status?: 'process' | 'pending' | 'paid' | 'failure' | 'cancel'
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


