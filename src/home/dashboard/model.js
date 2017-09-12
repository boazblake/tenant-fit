import Task from 'data.task'
import { compose, map, identity, lensProp } from 'ramda'
import { log } from 'utilities'

export const grabIds = dto => dto._id

export const getResponse = data => data.response

export const safeParse =
  compose(JSON.parse, getResponse)

export const toViewModel =
  compose(map(grabIds), safeParse)

export const get = http => id =>
  http.get(`http://localhost:8080/tenants/userId/${id}`)

export const getTask = http => id =>
  new Task((rej, res) => get(http)(id).then(res, rej))

export const getTenantsTask = http =>
  compose(map(toViewModel), getTask(http))