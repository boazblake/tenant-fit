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

// ===VALIDATE Tenant============================================================
export const validate = dto => {
  let validation =
  dto.selectedTenant
    ? (dto.addTenant && dto.addTenant.name)
      ? {msg: 'please select one and leave the other blank'}
      : dto.selectedTenant
    : dto.addTenant
      ? dto.addTenant
      : {msg: 'please select a user'}

  return validation
}

export const toTask = dto =>
  dto.msg
    ? Task.rejected(dto.msg)
    : Task.of(dto)

export const validateTenantTask =
  compose(map(log('state')), toTask, validate )


  // ===ADD TENANT============================================================

export const add = http => data =>
  http.post(`http://localhost:8080/tenants/add`, data)

export const addTask = http => data =>
  new Task( (rej, res) => add(http)(data).then(res, rej))

export const addTenantTask = http => userId => tenantUserId =>
  // compose(map(toViewModel), map(identity(dto => JSON.parse(dto.response))), addTask(http), toRequest(userId)(tenantUserId))
  compose(map(map(toViewModel)),map(log('dto to create tenant')),chain(eitherToTask), map(parse), addTask(http), toRequest(userId)(tenantUserId))
