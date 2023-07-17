import mongoose, { Schema } from 'mongoose'
import {
  IPaymentCampaign,
  IResponseMidtrans,
} from './paymentCampaign.interface.js'

const Midtrans_Response: Schema<IResponseMidtrans> = new mongoose.Schema({
  redirect_url: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
})

const paymentCampaignSchema: Schema<IPaymentCampaign> = new mongoose.Schema(
  {
    id_charity: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Charity',
    },
    id_user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User',
    },
    amount: {
      type: Number,
      min: 1,
      required: [true, 'amount is required'],
      // default: null,
    },
    quantity: {
      type: Number,
      min: 1,
      required: [true, 'quantity is required'],
    },
    status: {
      type: String,
      required: [true, 'status is required'],
      default: 'process',
    },
    response_midtrans: {
      type: Midtrans_Response,
      default: null,
    },
  },
  { timestamps: true }
)

const PaymentCampaign = mongoose.model<IPaymentCampaign>(
  'Payment-Campaign',
  paymentCampaignSchema
)

export default PaymentCampaign
