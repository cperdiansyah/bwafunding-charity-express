import mongoose, { Schema } from 'mongoose'
import { ICharityFundHistory } from './charityInterface.js'

const charityFundHistorySchema: Schema<ICharityFundHistory> =
  new mongoose.Schema(
    {
      campaign_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'campaign_id is required'],
        ref: 'Charity',
      },
      transaction_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'transaction_id is required'],
        ref: 'Transaction',
      },
      timestamp: {
        type: Number,
        required: [true, 'transaction_id is required'],
        default: Date.now,
      },
      funding_status: {
        type: String,
        required: [true, 'funding_status is required'],
      },
    },
    { timestamps: true }
  )

const CharityFundHistory = mongoose.model<ICharityFundHistory>(
  'Charity_Fund_history',
  charityFundHistorySchema
)

export default CharityFundHistory
