import { compose, chain, map } from 'ramda'
import Task from 'data.task'
import { eitherToTask, parse } from 'utilities'

export const toTenantDto = Dto => {
  console.log(Dto)
  const dto = {
    name: Dto.Name,
    _id: Dto._id
  }
  return dto
}

export const getTenants = http => userId => adminId =>
  http.get(`https://buxy-proxy.herokuapp.com/tenants/userId/${userId}`)

export const getTenantsTask = http => userId => adminId =>
  new Task((rej, res) => getTenants(http)(userId)(adminId).then(res, rej))

export const loadTask = http => userId => adminId =>
  compose(
    map(map(toTenantDto)),
    chain(eitherToTask),
    map(parse),
    getTenantsTask(http)(userId)
  )(adminId)
