import { Types } from 'mongoose'

export interface IBanner {
  title: string
  content: string
  redirection_link: string
  image: string
  start_date: Date | null
  end_date: Date | null
  status: 'accept' | 'inactive'
  author: Types.ObjectId | null
}
