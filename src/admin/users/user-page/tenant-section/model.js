import { compose, chain, map } from 'ramda'
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
