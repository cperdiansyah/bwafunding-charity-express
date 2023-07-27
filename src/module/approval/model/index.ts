import mongoose, { Schema } from 'mongoose'
import { IApproval } from './approval.interface.js'
const approvalSchema: Schema<IApproval> = new mongoose.Schema(
  {
    status: {
      type: String,
      required: [true, 'title is required'],
      default: 'pending',
    },
    approval_type: {
      type: String,
      required: [true, 'approval_type is required'],
    },
    foreign_id: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: 'User' || 'Charity' || 'Banner',
      required: true,
    },
    refModel: {
      type: String,
      required: true,
      enum: ['User', 'Charity', 'Banner'], // The model that foreign_id references
    },
  },
  { timestamps: true }
)

const Approval = mongoose.model<IApproval>('Approval', approvalSchema)

export default Approval
