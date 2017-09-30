import Task from 'data.task'
import { compose, chain, identity, map } from 'ramda'
import { eitherToTask, log, parse } from 'utilities'
import moment from 'moment'

export const parseDate = date =>
  moment.utc(date)

export const toViewModel = Dto => {
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

export const getStore = http => id =>
  http.get(`http://localhost:8080/stores/${id}`)

export const getStoreTask = http => id =>
  new Task((rej, res) => getStore(http)(id).then(res, rej))


export const loadTask = http =>
  compose(map(toViewModel),chain(eitherToTask), map(parse), getStoreTask(http))
