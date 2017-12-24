import { compose, chain, identity, map } from 'ramda'
import Task from 'data.task'
import { log, eitherToTask, parse } from 'utilities'

export const tostoreDto = Dto => {
  const dto = {
    name: Dto.Name,
    _id: Dto._id,
    tenantId: Dto.TenantId
  }
  return dto
}

export const stores = http => userId => adminId => storeId =>
  http.get(`http://localhost:8080/stores/store/${storeId}`)

export const addStores = http => userId => adminId => store =>
  new Task((rej, res) =>
    stores(http)(userId)(adminId)(store._id).then(res, rej)
  )

export const addStoresTask = http => userId => adminId =>
  compose(
    map(log('brands??')),
    chain(eitherToTask),
    chain(parse),
    map(addStores(http)(userId)(adminId))
  )

export const getstores = http => userId => adminId =>
  http.get(`http://localhost:8080/stores/userId/${userId}`)

export const getstoresTask = http => userId => adminId =>
  new Task((rej, res) => getstores(http)(userId)(adminId).then(res, rej))

export const loadTask = http => userId => adminId =>
  compose(
    map(map(tostoreDto)),
    chain(eitherToTask),
    map(parse),
    getstoresTask(http)(userId)
  )(adminId)

export const filteredStores = filter => x => x.tenantId === filter

export const filterList = filter => xs =>
  filter === '' ? identity(xs) : xs.filter(x => x.tenantId === filter)

export const filterTask = filter => compose(Task.of, filterList(filter))
