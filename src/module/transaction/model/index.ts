import mongoose, { Schema } from 'mongoose'
import { ITransaction, IResponseMidtrans } from './transaction.interface.js'

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

const transactionSchema: Schema<ITransaction> = new mongoose.Schema(
  {
    campaign_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Charity',
    },
    user_id: {
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
    transaction_type: {
      type: String,
      required: [true, 'amount is required'],
      default: 'campaign',
    },
  },
  { timestamps: true }
)

const Transaction = mongoose.model<ITransaction>(
  'transaction',
  transactionSchema
)

export default Transaction
