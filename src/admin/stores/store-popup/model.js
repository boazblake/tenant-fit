import Task from 'data.task'
import { compose, map, identity } from 'ramda'
import { log } from 'utilities'
import moment from 'moment'

export const parseDate = date =>
  moment.utc(date)

export const dirtyState = oldStore => {
  console.log(oldStore)
}


export const toVm = Dto => {
  console.log('DTO', Dto)
  let dto =
    { comments: Dto.Comments
    , confirmedOn: Dto.ConfirmedOn
    , emailOptIn: Dto.EmailOptIm
    , isConfirmed: Dto.IsConfirmed
    , landlordEntity: Dto.LandlordEntity
    , LeaseNotificationArray: Dto.LeaseNotificationArray
    , leaseExpirationDate: parseDate(Dto.LeaseExpirationDate)
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

export const toDto = adminId => dto => {
  let Dto =
  { Comments: dto.comments
  , ConfirmedOn: dto.isConfirmed ? moment() : ''
  , EmailOptIm: dto.emailOptIn
  , IsConfirmed: dto.isConfirmed
  , LandlordEntity: dto.landlordEntity
  , LeaseExpirationDate: dto.leaseExpirationDate
  , LeaseNotificationDate: dto.leaseNotificationDate
  , LeaseNotificationArray: dto.leaseNotificationArray
  , ModifiedBy: adminId
  , Name: dto.name
  , PropertyName: dto.propertyName
  , TenantId: dto.tenantId
  , UserId: dto.userId
  , createdAt: dto.createdAt
  , _id: dto._id
  }

  return Dto
}


// GET STORE===============================================================================
export const get = http => id =>
  http.get(`http://localhost:8080/stores/${id}`)

export const getTask = http => id =>
  new Task((rej, res) => get(http)(id).then(res, rej))

export const getStoreTask = http =>
  compose(map(toVm),map(identity(dto => JSON.parse(dto.response))),  getTask(http))



  // UPDATE STORE===============================================================================
export const update = http => adminId => storeId => Dto =>
  http.put(`http://localhost:8080/admin/${adminId}/allstores/${storeId}`, Dto)

export const updateStore = http => adminId => storeId => Dto =>
  new Task((rej, res) => update(http)(adminId)(storeId)(Dto).then(res, rej))

export const updateStoreTask = http => adminId => storeId =>
  compose( map(toVm),  map(identity(Dto => JSON.parse(Dto.response))), updateStore(http)(adminId)(storeId), toDto(adminId))
