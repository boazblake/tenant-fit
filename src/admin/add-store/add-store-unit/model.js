import Task from 'data.task'
import { chain, compose, map, identity, toString } from 'ramda'
import { log, dateToIso, eitherToTask, parse } from 'utilities'
import moment from 'moment'


export const toLeaseNotificationArray = notifyDate => {
  const toTimeStamp = diffNum => date => {
    return moment(date).subtract(diffNum, 'days')
  }

  const notifyArray =
    [ toTimeStamp(90)(notifyDate)
    , toTimeStamp(60)(notifyDate)
    , toTimeStamp(30)(notifyDate)
    , toTimeStamp(10)(notifyDate)
    , toTimeStamp(5)(notifyDate)
    ]

  return notifyArray
}

export const toViewModel = Dto => {
    let dto =
      { name: Dto.Name }

    return dto
}

export const storeDto = clientId => tenantId => adminId => dto => {
  let Dto =
    { Name: dto.name
    , LandlordEntity: dto.landlordEntity
    , PropertyName: dto.propertyName
    , LeaseExpirationDate: dateToIso(dto.leaseExpirationDate)
    , LeaseNotificationDate: dateToIso(dto.leaseNotificationDate)
    , LeaseNotificationArray: toLeaseNotificationArray(dateToIso(dto.leaseNotificationDate))
    , Comments: dto.comments
    , TenantId: tenantId
    , UserId: clientId
    , ModifiedBy: adminId
    }

  return Task.of(Dto)
}

export const toStoreDto = clientId => tenantId => adminId =>
  storeDto(clientId)(tenantId)(adminId)

export const saveStore = http => data =>
  http.post(`http://localhost:8080/stores/add`, data)

export const saveStoreTask = http => data =>
  new Task( (rej, res) => saveStore(http)(data).then(res, rej))

export const toSaveStoreTask = http  =>
  compose(map(toViewModel), chain(eitherToTask), map(parse),  saveStoreTask(http))
