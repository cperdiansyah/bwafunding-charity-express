import mongoose, { Schema } from 'mongoose'
import { IApproval } from './approval.interface.js'
const approvalSchema: Schema<IApproval> = new mongoose.Schema(
  {
    status: {
      type: String,
      required: [true, 'title is required'],
    },
    approval_type: {
      type: String,
      required: [true, 'approval_type is required'],
    },
    foreign_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' || 'Charity' || 'Banner',
    },
  },
  { timestamps: true }
)

const Approval = mongoose.model<IApproval>('Charity', approvalSchema)

export default Approval
