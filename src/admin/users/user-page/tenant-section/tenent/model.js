import Task from 'data.task'
import { compose, chain, map } from 'ramda'
import { eitherToTask, parse } from 'utilities'
import moment from 'moment'

export const parseDate = date => moment.utc(date)

export const toViewModel = Dto => {
  let dto = {
    name: Dto.Name,
    _id: Dto._id
  }

  return dto
}

export const toDto = adminId => dto => {
  let Dto = {
    Name: dto.name,
    _id: dto._id,
    ModifiedBy: adminId
  }

  return Dto
}

// UPDATE TENANT===============================================================================
export const update = http => adminId => tenantId => Dto =>
  http.put(`https://buxy-proxy.herokuapp.com/tenants/${tenantId}`, Dto)

export const updateTask = http => adminId => tenantId => Dto =>
  new Task((rej, res) => update(http)(adminId)(tenantId)(Dto).then(res, rej))

export const toSubmitTask = http => adminId => tenantId =>
  compose(
    map(toViewModel),
    chain(eitherToTask),
    map(parse),
    updateTask(http)(adminId)(tenantId),
    toDto(adminId)
  )

// DELETE TENANT===============================================================================
export const remove = http => adminId => tenantId =>
  http.delete(`https://buxy-proxy.herokuapp.com/tenants/${tenantId}`)

export const removeTask = http => adminId => tenantId =>
  new Task((rej, res) => remove(http)(adminId)(tenantId).then(res, rej))

export const toRemoveTask = http => adminId =>
  compose(chain(eitherToTask), map(parse), removeTask(http)(adminId))

// DESTINATION TENANT===============================================================================
export const checkDto = http => adminId => tenantId => dto =>
  dto.toRemove
    ? toRemoveTask(http)(adminId)(tenantId)
    : toSubmitTask(http)(adminId)(tenantId)(dto)

export const toDestinationTask = http => adminId => tenantId =>
  compose(checkDto(http)(adminId)(tenantId))

// COLOR TENANT===============================================================================
export const getChangeColor = bool => (bool ? 'red' : '')
