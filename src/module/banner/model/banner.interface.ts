import { Types } from 'mongoose'

export interface IBanner {
  title: string
  redirection_link: string
  image: string
  start_date: Date | null
  end_date: Date | null
  status: 'active' | 'inactive' | 'pending'
  author?: Types.ObjectId | null
}
