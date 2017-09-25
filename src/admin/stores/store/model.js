import Task from 'data.task'
import { compose, map, identity } from 'ramda'
import { log } from 'utilities'
import moment from 'moment'

export const parseDate = date =>
  moment.utc(date)

export const toVm = Dto => {
  let dto =
    { comments: Dto.Comments
    , isConfirmed: Dto.IsConfirmed
    , landlordEntity: Dto.LandlordEntity
    , leaseExpirationDate: parseDate(Dto.LeaseExpirationDate)
    , leaseNotificationArray: Dto.LeaseNotificationArray
    , leaseNotificationDate: parseDate(Dto.LeaseNotificationDate)
    , modifiedBy: Dto.ModifiedBy
    , name: Dto.Name
    , propertyName: Dto.PropertyName
    , tenantId: Dto.TenantId
    , userId: Dto.UserId
    , createdAt: Dto.createdAt
    , _id: Dto._id
    }

  return dto
}

export const get = http => id =>
  http.get(`http://localhost:8080/stores/${id}`)

export const getTask = http => id =>
  new Task((rej, res) => get(http)(id).then(res, rej))

export const getStoreTask = id =>
  compose(map(toVm), map(identity(dto => JSON.parse(dto.response))), getTask(id))