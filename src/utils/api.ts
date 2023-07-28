import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

export const SERVICE = {
  Payment: '/api/v1/payment',
  PaymentGeneral: '/api/v1/payment/general',
  PaymentCharity: '/api/v1/payment/charity',

  // user
  User: '/api/v1/user',
  //approval
  Approval: '/api/v1/approval',
  // Poin
  Point: '/api/v1/point',
}

export const BASE_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': 'true',
  // Authorization: `Bearer ${token ? token : ''}`,
}

export const api = axios.create({
  baseURL: process.env.BASE_URL,
  headers: BASE_HEADERS,
  withCredentials: true,
})
