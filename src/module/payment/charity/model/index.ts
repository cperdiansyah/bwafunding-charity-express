import mongoose, { Schema } from 'mongoose'
import { IPaymentCampaign } from './paymentCampaign.interface.js'

const paymentCampaignSchema: Schema<IPaymentCampaign> = new mongoose.Schema({})

const PaymentCampaign = mongoose.model<IPaymentCampaign>(
  'PaymentCampaign',
  paymentCampaignSchema
)

export default PaymentCampaign