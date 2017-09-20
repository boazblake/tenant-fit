import Task from 'data.task'
import { compose, map, identity } from 'ramda'
import { log } from 'utilities'
import moment from 'moment'

export const parseDate = date =>
  moment(date).format('ll')

export const toVm = Dto => {
  let dto =
  { comments: Dto.Comments
  , isConfirmed: Dto.IsConfirmed
  , landlordEntity: Dto.LandlordEntity
  , leaseExpirationDate: parseDate(Dto.LeaseExpirationDate)
  , LeaseNotificationArray: Dto.LeaseNotificationArray
  , leaseExpirationDate: parseDate(Dto.LeaseNotificationDate)
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
  , IsConfirmed: dto.isConfirmed
  , landlordEntity: dto.landlordEntity
  , LeaseExpirationDate: dto.leaseExpirationDate
  , LeaseNotificationArray: dto.leaseNotificationArray
  , LeaseExpirationDate: dto.leaseNotificationDate
  , ModifiedBy: adminId
  , Name: dto.name
  , PropertyName: dto.propertyName
  , TenantId: dto.tenantId
  , UserId: dto.userId
  , createdAt: dto.createdAt
  }

  return Dto
}


// GET STORE===============================================================================
export const get = http => id =>
  http.get(`https://buxy-proxy.herokuapp.com/stores/${id}`)

export const getTask = http => id =>
  new Task((rej, res) => get(http)(id).then(res, rej))

export const getStoreTask = http =>
  compose(map(toVm),map(identity(dto => JSON.parse(dto.response))),  getTask(http))



// UPDATE STORE===============================================================================
export const update = http => adminId => storeId => Dto =>
  http.put(`https://buxy-proxy.herokuapp.com/admin/${adminId}/allstores/${storeId}`, Dto)

export const updateStore = http => adminId => storeId => Dto =>
  new Task((res, rej) => update(http)(adminId)(Dto))

export const updateStoreTask = http => adminId => storeId =>
  compose(log('dto'), map(toVm), map(identity(Dto => JSON.parse(Dto.response))), updateStore(http)(adminId)(storeId),  toDto(adminId))