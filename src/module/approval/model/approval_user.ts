import mongoose, { Schema } from 'mongoose'
import { IApprovalUser } from './approval.interface.js'
const approvalUserSchema: Schema<IApprovalUser> = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approval_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Approval',
    },
    description: {
      type: String,
      required: [true, 'description is required'],
    },
    file_url: {
      type: String,
      required: false,
      default: null,
    },
    images_url: {
      type: Array<String>,
      required: false,
      default: null,
    },
  },
  { timestamps: true }
)

const ApprovalUser = mongoose.model<IApprovalUser>(
  'Approval_User',
  approvalUserSchema
)

export default ApprovalUser
