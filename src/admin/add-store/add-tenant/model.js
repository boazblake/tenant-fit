import Task from 'data.task'
import { compose, chain, identity, map } from 'ramda'
import { eitherToTask, log, parse } from 'utilities'

export const toViewModel = dto =>
  ({ id: dto._id
  , name: dto.Name
  })

export const toRequest = userId => tenantUserId => dto =>
  ({ Name: dto.name
  , UserId: tenantUserId
  , ModifiedBy: userId
  })


export const tenants = http => id =>
  http.get(`http://localhost:8080/tenants/userId/${id}`)

export const getTenants = http => id =>
  new Task((rej, res) => tenants(http)(id).then(res, rej))

export const loadTask = http =>
  compose(map(map(toViewModel)), chain(eitherToTask), map(parse), getTenants(http))

export const add = http => data =>
  http.post(`http://localhost:8080/tenants/add`, data)

export const addTask = http => data =>
  new Task( (rej, res) => add(http)(data).then(res, rej))

export const addTenantTask = http => userId => tenantUserId =>
  compose(map(toViewModel), chain(eitherToTask), map(parse), addTask(http), toRequest(userId)(tenantUserId))
