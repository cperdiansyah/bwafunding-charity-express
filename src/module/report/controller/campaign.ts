export const CAMPAIGN_STATUS = {
  ACCEPT: 'On Going', //GREEN
  PENDING: 'pending', //GRAY
  REJECTED: 'rejected', //RED
  COMPLETED: 'Done', //BLUE
}

export const CAMPAIGN_STATUS_WITH_COLORS = [
  {
    label: 'accept',
    color: 'blue',
    status: CAMPAIGN_STATUS.ACCEPT,
  },
  {
    label: 'pending',
    color: 'default',
    status: CAMPAIGN_STATUS.PENDING,
  },
  {
    label: 'rejected',
    color: 'red',
    status: CAMPAIGN_STATUS.REJECTED,
  },
  {
    label: 'completed',
    color: 'green',
    status: CAMPAIGN_STATUS.COMPLETED,
  },
]
