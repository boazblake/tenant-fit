import Task from 'data.task'
import { compose, map, identity } from 'ramda'
import { log } from 'utilities'

export const toVm = Dto => {
  let dto =
    { name: Dto.Name
    // , landlordEntity: Dto.LandlordEntity
    , propertyName: Dto.PropertyName
    , leaseExpirationDate: Dto.LeaseExpirationDate
    , leaseNotificationDate: Dto.LeaseNotificationDate
    , _id: Dto._id
    // , comments: Dto.Comments
    // , tenantId: TenantId
    // , userId: ClientId
    }

  return dto
}

export const get = http => id =>
  http.get(`http://localhost:8080/stores/${id}`)

export const getTask = http => id =>
  new Task((rej, res) => get(http)(id).then(res, rej))

export const getStoreTask = id =>
  compose(map(toVm), map(identity(dto => JSON.parse(dto.response))), getTask(id))