import { compose, chain, map } from 'ramda'
import Task from 'data.task'
import { log, eitherToTask, parse } from 'utilities'

export const getLogo = http => userId => adminId => tenant =>
  http.get(`http://localhost:8080/stores/tenantId/${tenant._id}`)

export const getLogoTask = http => userId => adminId => tenant => {
  console.log('dddd', tenant._id)
  return new Task((rej, res) =>
    getLogo(http)(userId)(adminId)(tenant).then(res, rej)
  )
}

export const getBrands = http => userId => adminId =>
  compose(log('stores??'), getLogoTask(http)(userId)(adminId))

export const toViewModel = Dto => {
  const dto = {
    name: Dto.Name,
    _id: Dto._id
  }

  return dto
}

export const getTenants = http => userId => adminId =>
  http.get(`http://localhost:8080/tenants/userId/${userId}`)

export const getTenantsTask = http => userId => adminId =>
  new Task((rej, res) => getTenants(http)(userId)(adminId).then(res, rej))

export const loadTask = http => userId => adminId =>
  compose(
    map(log('tenants')),
    map(map(toViewModel)),
    chain(eitherToTask),
    map(parse),
    getTenantsTask(http)(userId)
  )(adminId)
