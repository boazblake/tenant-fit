import { compose, chain, keys, map, values } from 'ramda'
import Task from 'data.task'
import { log, eitherToTask, parse } from 'utilities'

export const toTenantDto = Dto => {
  const dto = {
    name: Dto.Name,
    _id: Dto._id
  }
  return dto
}

export const stores = http => userId => adminId => tenantId =>
  http.get(`http://localhost:8080/stores/tenant/${tenantId}`)

export const addStores = http => userId => adminId => tenant => {
  // stores(http)(userId)(adminId)(tenant._id)
  // .then(x => console.log('x', x))
  return new Task((rej, res) =>
    stores(http)(userId)(adminId)(tenant._id).then(res, rej)
  )
}

export const addStoresTask = http => userId => adminId =>
  compose(
    map(log('brands??')),
    chain(eitherToTask),
    chain(parse),
    map(addStores(http)(userId)(adminId))
  )

export const getTenants = http => userId => adminId =>
  http.get(`http://localhost:8080/tenants/userId/${userId}`)

export const getTenantsTask = http => userId => adminId =>
  new Task((rej, res) => getTenants(http)(userId)(adminId).then(res, rej))

export const loadTask = http => userId => adminId =>
  compose(
    map(map(toTenantDto)),
    chain(eitherToTask),
    map(parse),
    getTenantsTask(http)(userId)
  )(adminId)

// UPDATE TENANT===============================================================================
export const update = http => adminId => userId => Dto =>
  http.put(`http://localhost:8080/users/${userId}`, Dto)

export const updateTask = http => adminId => userId => Dto =>
  new Task((rej, res) => update(http)(adminId)(userId)(Dto).then(res, rej))

export const toSubmitTask = http => adminId => userId =>
  compose(
    map(toViewModel),
    chain(eitherToTask),
    map(parse),
    updateTask(http)(adminId)(userId),
    toDto(adminId)
  )

// DELETE TENANT===============================================================================

export const remove = http => adminId => userId =>
  http.delete(`http://localhost:8080/users/${userId}`)

export const removeTask = http => adminId => userId =>
  new Task((rej, res) => remove(http)(adminId)(userId).then(res, rej))

export const toRemoveTask = http => adminId =>
  compose(chain(eitherToTask), map(parse), removeTask(http)(adminId))

// DESTINATION TENANT===============================================================================

export const checkDto = http => adminId => userId => dto =>
  dto.toRemove
    ? toRemoveTask(http)(adminId)(userId)
    : toSubmitTask(http)(adminId)(userId)(dto)

export const toDestinationTask = http => adminId => userId =>
  compose(checkDto(http)(adminId)(userId))

// COLOR TENANT===============================================================================
export const getChangeColor = bool => (bool ? 'red' : '')
