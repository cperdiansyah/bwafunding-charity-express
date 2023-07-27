import dayjs from 'dayjs'

import { ICharity } from '../module/charity/model/charityInterface.js'

export function getRandomDate(startDate: Date, endDate: Date) {
  const diffInDays = dayjs(endDate).diff(startDate, 'day')
  const randomDays = Math.floor(Math.random() * (diffInDays - 21)) + 21
  return dayjs(startDate).add(randomDays, 'day').toDate()
}

const charities: ICharity[] = [
  {
    title: 'Charity 1',
    slug: 'charity-1',
    description: 'This is the first charity description.',
    status: 'accept',
    is_draft: false,
    donation_target: 5000,
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    post_date: new Date('2023-05-20'),
    author: null,
  },
  {
    title: 'Charity 2',
    slug: 'charity-2',
    description: 'This is the second charity description.',
    status: 'pending',
    is_draft: true,
    donation_target: 10000,
    start_date: new Date('2023-08-01'),
    end_date: new Date('2023-09-30'),
    post_date: new Date('2023-05-22'),
    author: null,
  },
  {
    title: 'Charity 3',
    slug: 'charity-3',
    description: 'This is the third charity description.',
    status: 'accept',
    is_draft: false,
    donation_target: 7500,
    start_date: new Date('2023-07-15'),
    end_date: new Date('2023-08-31'),
    post_date: new Date('2023-05-25'),
    author: null,
  },
  {
    title: 'Charity 4',
    slug: 'charity-4',
    description: 'This is the fourth charity description.',
    status: 'accept',
    is_draft: false,
    donation_target: 2000,
    start_date: new Date('2023-09-01'),
    end_date: new Date('2023-09-10'),
    post_date: new Date('2023-09-02'),
    author: null,
  },
  {
    title: 'Charity 5',
    slug: 'charity-5',
    description: 'This is the fifth charity description.',
    status: 'accept',
    is_draft: false,
    donation_target: 3000,
    start_date: new Date('2023-08-15'),
    end_date: new Date('2023-10-15'),
    post_date: new Date('2023-06-05'),
    author: null,
  },
  {
    title: 'Charity 6',
    slug: 'charity-6',
    description: 'This is the fifth charity description.',
    status: 'accept',
    is_draft: false,
    donation_target: 3000,
    start_date: new Date('2023-08-15'),
    end_date: new Date('2023-10-15'),
    post_date: new Date('2023-06-05'),
    author: null,
  },
  {
    title: 'Charity 7',
    slug: 'charity-7',
    description: 'This is the fifth charity description.',
    status: 'accept',
    is_draft: false,
    donation_target: 3000,
    start_date: new Date('2023-08-15'),
    end_date: new Date('2023-10-15'),
    post_date: new Date('2023-06-05'),
    author: null,
  },
  {
    title: 'Charity 8',
    slug: 'charity-8',
    description: 'This is the fifth charity description.',
    status: 'accept',
    is_draft: false,
    donation_target: 3000,
    start_date: new Date('2023-08-15'),
    end_date: new Date('2023-10-15'),
    post_date: new Date('2023-06-05'),
    author: null,
  },
  {
    title: 'Charity 9',
    slug: 'charity-9',
    description: 'This is the fifth charity description.',
    status: 'accept',
    is_draft: false,
    donation_target: 3000,
    start_date: new Date('2023-08-15'),
    end_date: new Date('2023-10-15'),
    post_date: new Date('2023-06-05'),
    author: null,
  },
  {
    title: 'Charity 10',
    slug: 'charity-10',
    description: 'This is the fifth charity description.',
    status: 'accept',
    is_draft: false,
    donation_target: 3000,
    start_date: new Date('2023-08-15'),
    end_date: new Date('2023-10-15'),
    post_date: new Date('2023-06-05'),
    author: null,
  },
]

// Update the charities array
charities?.forEach((charity) => {
  // Update start_date to current date
  charity.start_date = dayjs().toDate()

  // Update end_date to a random date after start_date, at least 3 weeks away
  charity.end_date = getRandomDate(
    charity.start_date,
    dayjs(charity.start_date).add(3, 'week').toDate()
  )

  // Update post_date to a random date between start_date and end_date
  charity.post_date = getRandomDate(charity.start_date, charity.end_date)
})

export default charities
