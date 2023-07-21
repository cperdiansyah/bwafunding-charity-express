import { Types } from "mongoose"

export interface IApproval {
  status: 'accept' | 'rejected'
  approval_type: 'charity' | 'user' | 'banner'
  foreign_id:  Types.ObjectId | null
}
