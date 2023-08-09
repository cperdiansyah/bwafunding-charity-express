import mongoose, { Schema } from 'mongoose'
import { IPoinHistory } from './exchange.interface.js'

// Define poin schema
const poinHisorySchema: Schema<IPoinHistory> = new mongoose.Schema(
  {
    id_point: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'id_user is required'],
      ref: 'Poin',
    },
    value: {
      type: Number,
      required: [true, 'value is required'],
    },
    timestamp: {
      type: Number,
      required: [true, 'timestamp is required'],
    },
    history_type: {
      type: String,
      required: [true, 'history_type is required'],
    },
  },
  { timestamps: true }
)
const PoinHistory = mongoose.model<IPoinHistory>(
  'Poin_History',
  poinHisorySchema
)

export default PoinHistory
