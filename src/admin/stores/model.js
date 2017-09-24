import Task from 'data.task'
import { compose, map, identity, prop, toLower, sortBy } from 'ramda'
import { log } from 'utilities'

const sorter = sortType =>
  sortBy(compose(toLower,  prop(sortType)))

export const toVm = Dto => {
  let dto =
    { name: Dto.Name
    , leaseExpDate: Dto.LeaseExpirationDate
    , leaseNotifDate: Dto.LeaseNotificationDate
    , _id: Dto._id
    }
  return dto
}

export const get = http => id =>
  http.get(`http://localhost:8080/admin/${id}/allstores`, id)
  // http.get(`http://localhost:8080/admin/${id}/allStores`)

export const getTask = http => id =>
  new Task((rej, res) => get(http)(id).then(res, rej))

export const getStoresTask = http =>
  compose(map(map(toVm)), map(identity(dto => JSON.parse(dto.response))), getTask(http))

export const sortStores = sortType => stores =>
  sorter(sortType)(stores)