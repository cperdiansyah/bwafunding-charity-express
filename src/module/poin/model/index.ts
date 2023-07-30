import mongoose, { Schema } from 'mongoose'
import { IPoin } from './poin.interface.js'

// Define poin schema
const poinSchema: Schema<IPoin> = new mongoose.Schema(
  {
    id_user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'id_user is required'],
      ref: 'User',
    },
    value: {
      type: Number,
      required: [true, 'value is required'],
      default: 0,
    },
  },
  { timestamps: true }
)
const Poin = mongoose.model<IPoin>('Poin', poinSchema)

export default Poin
