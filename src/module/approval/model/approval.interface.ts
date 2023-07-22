import { Types } from 'mongoose'

export interface IApproval {
  status?: 'accept' | 'rejected' | 'pending'
  approval_type: 'charity' | 'user' | 'banner'
  foreign_id: Types.ObjectId | null
}

export interface IApprovalUser {
  approval_id?: Types.ObjectId
  user_id?: Types.ObjectId
  description: string
  file_url?: string
  images_url?: string[]
}
