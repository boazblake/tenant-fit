import Task from 'data.task'
import { assoc, compose, chain, map, prop } from 'ramda'
import { eitherToTask, parse } from 'utilities'
import moment from 'moment'

export const parseDate = date => moment.utc(date, 'YYYYMMDD')

export const dirtyState = oldStore => {
  console.log(oldStore)
}

export const toVm = Dto => {
  console.log('toVM', parseDate(Dto.LeaseExpirationDate))
  let dto = {
    comments: Dto.Comments,
    confirmedOn: Dto.ConfirmedOn,
    emailOptIn: Dto.EmailOptIm,
    isConfirmed: Dto.IsConfirmed,
    landlordEntity: Dto.LandlordEntity,
    LeaseNotificationArray: Dto.LeaseNotificationArray,
    leaseExpirationDate: parseDate(Dto.LeaseExpirationDate),
    leaseNotificationDate: parseDate(Dto.LeaseNotificationDate),
    modifiedBy: Dto.ModifiedBy,
    name: Dto.Name,
    propertyName: Dto.PropertyName,
    tenantId: Dto.TenantId,
    userId: Dto.UserId,
    brandId: Dto.BrandId,
    createdAt: Dto.createdAt,
    _id: Dto._id
  }

  return dto
}

export const toDto = userId => dto => {
  console.log('toDto', parseDate(dto.LeaseExpirationDate))
  let Dto = {
    Comments: dto.comments,
    ConfirmedOn: dto.isConfirmed ? moment() : '',
    EmailOptIm: dto.emailOptIn,
    IsConfirmed: dto.isConfirmed,
    LandlordEntity: dto.landlordEntity,
    LeaseExpirationDate: dto.leaseExpirationDate,
    LeaseNotificationDate: dto.leaseNotificationDate,
    LeaseNotificationArray: dto.leaseNotificationArray,
    ModifiedBy: userId,
    Name: dto.name,
    PropertyName: dto.propertyName,
    TenantId: dto.tenantId,
    UserId: dto.userId,
    createdAt: dto.createdAt,
    _id: dto._id
  }

  return Dto
}

// GET STORE===============================================================================
export const get = http => id =>
  http.get(`https://buxy-proxy.herokuapp.com/stores/${id}`)

export const getTask = http => id =>
  new Task((rej, res) => get(http)(id).then(res, rej))

export const loadTask = http =>
  compose(map(toVm), chain(eitherToTask), map(parse), getTask(http))

// UPDATE STORE===============================================================================
export const update = http => userId => storeId => Dto =>
  http.put(`https://buxy-proxy.herokuapp.com/stores/${storeId}`, Dto)

export const updateStore = http => userId => storeId => Dto =>
  new Task((rej, res) => update(http)(userId)(storeId)(Dto).then(res, rej))

export const updateStoreTask = http => userId => storeId =>
  compose(
    map(toVm),
    chain(eitherToTask),
    map(parse),
    updateStore(http)(userId)(storeId),
    toDto(userId)
  )

// =================================GET BRAND==========================================================
const toBrand = dto => {
  const brand = { logo: prop('Logo', dto), name: prop('Name', dto) }
  return brand
}

export const toViewModel = storeDto => brandDto => {
  const storeModel = assoc('brand', toBrand(brandDto), storeDto)
  return storeModel
}

export const getBrand = http => store =>
  http.get(`https://buxy-proxy.herokuapp.com/brands/${store.brandId}`)

export const getLogoTask = http => store =>
  new Task((rej, res) => getBrand(http)(store).then(res, rej))

export const getBrandTask = http => storeDto =>
  compose(
    map(toViewModel(storeDto)),
    chain(eitherToTask),
    map(parse),
    getLogoTask(http)
  )(storeDto)
