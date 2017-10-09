import Task from 'data.task'
import { compose, chain, identity, map } from 'ramda'
import { eitherToTask, log, parse } from 'utilities'

export const toViewModel = dto =>
  ({ id: dto._id
  , name: dto.Name
  })

export const toRequest = userId => tenantUserId => dto =>{
  console.log(tenantUserId)
  return ({ Name: dto.name
  , UserId: tenantUserId
  , ModifiedBy: userId
  })
}

export const tentants = http => id =>
  http.get(`http://localhost:8080/tenants/userId/${id}`)

export const getTenants = http => id =>
  new Task((rej, res) => tentants(http)(id).then(res, rej))

export const loadTask = http =>
  compose(map(map(toViewModel)),chain(eitherToTask), map(parse), getTenants(http))

export const add = http => data =>
  http.post(`http://localhost:8080/tenants/add`, data)

export const addTask = http => data =>
  new Task( (rej, res) => add(http)(data).then(res, rej))

export const addTenantTask = http => userId => tenantUserId =>
  // compose(map(toViewModel), map(identity(dto => JSON.parse(dto.response))), addTask(http), toRequest(userId)(tenantUserId))
  compose(map(toViewModel),map(log('dto to create tenant')),chain(eitherToTask), map(parse), addTask(http), toRequest(userId)(tenantUserId))
