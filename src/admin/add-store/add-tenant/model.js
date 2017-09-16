import Task from 'data.task'
import { compose, map, identity } from 'ramda'
import { log } from 'utilities'

export const tenantModel = dto =>
  dto

export const toVm = dto =>
  ({ id: dto._id
  , name: dto.Name
  })


export const toRequest = userId => tenantUserId => dto =>
  ({ Name: dto.name
  , UserId: tenantUserId
  , ModifiedBy: userId
  })

export const toUserVm = dto =>
  ({ name: dto.name
  })

export const tentants = http => id =>
  http.get(`http://localhost:8080/tenants/userId/${id}`)

export const getTenants = http => id =>
  new Task((rej, res) => tentants(http)(id).then(res, rej))

export const getTenantsTask = id =>
  compose(map(map(toVm)), map(identity(dto => JSON.parse(dto.response))),  getTenants(id))

// ===VALIDATE USER============================================================
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
  compose(map(toVm), map(identity(dto => JSON.parse(dto.response))), addTask(http), toRequest(userId)(tenantUserId))
  // compose(console.log('type', type, 'http', http, 'id', id, 'data',data))