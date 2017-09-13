import Task from 'data.task'
import { compose, map, identity, lensProp } from 'ramda'
import { log } from 'utilities'

export const get = http => id =>
  http.get(`http://localhost:8080/tenants/userId/${id}`)

export const getTask = http => id =>
  new Task((rej, res) => get(http)(id).then(res, rej))

export const getTenantsTask = http =>
  compose(map(identity(dto => JSON.parse(dto.response))), getTask(http))