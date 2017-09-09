import { log } from 'utilities'

export const checkAuth = _ =>
  localStorage.userId ? true : false

export const checkUserId = _ =>
  localStorage.userId ? JSON.parse(localStorage.userId) : false


