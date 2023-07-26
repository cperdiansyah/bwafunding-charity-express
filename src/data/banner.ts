import dayjs from 'dayjs'
import { IBanner } from '../module/banner/model/banner.interface.js'
import { getRandomDate } from './charity.js'

const banners: IBanner[] = [
  {
    title: 'Banner test',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 1',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 2',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 3',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 4',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 5',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 6',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 7',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 8',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 9',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 10',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 11',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 12',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 13',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 14',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 15',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 16',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 17',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 18',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 19',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 20',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 21',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 22',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 23',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 24',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
  {
    title: 'Banner test 25',
    start_date: new Date('2023-06-01'),
    end_date: new Date('2023-07-31'),
    redirection_link: 'https://google.com/',
    status: 'accept',
    image:
      'https://uangonline.com/wp-content/uploads/2023/01/program-charity.jpg',
  },
]
// Update the charities array
banners?.forEach((banner) => {
  // Update start_date to current date
  banner.start_date = dayjs().toDate()

  // Update end_date to a random date after start_date, at least 3 weeks away
  banner.end_date = getRandomDate(
    banner.start_date,
    dayjs(banner.start_date).add(3, 'week').toDate()
  )

  // Update post_date to a random date between start_date and end_date
  // charity.post_date = getRandomDate(charity.start_date, charity.end_date)
})

export default banners
