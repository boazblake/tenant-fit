import Task from 'data.task'
import { compose, map, identity } from 'ramda'
import { log } from 'utilities'

export const toVm = Dto => {
    let dto =
      { name: Dto.Name }

    return dto
}

export const storeDto = clientId => tenantId => adminId => dto => {
  let Dto =
    { Name: dto.name
    , LandlordEntity: dto.landlordEntity
    , PropertyName: dto.propertyName
    , LeaseExpirationDate: dto.leaseExpirationDate
    , LeaseNotificationDate: dto.leaseNotificationDate
    , Comments: dto.comments
    , TenantId: tenantId
    , UserId: clientId
    , ModifiedBy: adminId
    }

  return Task.of(Dto)
}

export const toStoreDto = clientId => tenantId => adminId => store =>
  storeDto(clientId)(tenantId)(adminId)(store)

export const add = http => data =>
  http.post(`http://localhost:8080/stores/add`, data)

export const addTask = http => data =>
  new Task( (rej, res) => add(http)(data).then(res, rej))

export const addStoreTask = http  =>
  compose(map(toVm), map(identity(dto => JSON.parse(dto.response))), addTask(http))

export const validateStoreTask = dto =>
  Task.of(map(log('data')),map(toVm),dto)