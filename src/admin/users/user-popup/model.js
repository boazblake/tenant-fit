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

export const get = http => adminId => userId =>
  http.get(`http://localhost:8080/admin/${adminId}/users/${userId}`)

export const getTask = http => adminId => userId =>
  new Task((rej, res) => get(http)(adminId)(userId).then(res, rej))

export const getUserTask = adminId => userId =>
  compose(map(identity(dto => JSON.parse(dto.response))), getTask(adminId)(userId))