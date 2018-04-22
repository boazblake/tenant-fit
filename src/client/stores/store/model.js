import Task from 'data.task'
import { assoc, compose, chain, map, prop } from 'ramda'
import { eitherToTask, parse } from 'utilities'
import moment from 'moment'

export const parseDate = date => moment.utc(date)

export const toStoreModel = Dto => {
  let dto = {
    comments: Dto.Comments,
    isConfirmed: Dto.IsConfirmed,
    landlordEntity: Dto.LandlordEntity,
    leaseExpirationDate: parseDate(Dto.LeaseExpirationDate),
    leaseNotificationArray: Dto.LeaseNotificationArray,
    leaseNotificationDate: parseDate(Dto.LeaseNotificationDate),
    modifiedBy: Dto.ModifiedBy,
    name: Dto.Name,
    propertyName: Dto.PropertyName,
    tenantId: Dto.TenantId,
    brandId: Dto.BrandId,
    userId: Dto.UserId,
    createdAt: Dto.createdAt,
    _id: Dto._id
  }

  return dto
}

// =================================GET STORE==========================================================
export const getStore = http => id =>
  http.get(`https://buxy-proxy.herokuapp.com/stores/${id}`)

export const getStoreTask = http => id =>
  new Task((rej, res) => getStore(http)(id).then(res, rej))

export const loadTask = http =>
  compose(
    map(toStoreModel),
    chain(eitherToTask),
    map(parse),
    getStoreTask(http)
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

// =================================GET COLOR==========================================================
export const findColor = day => {
  if (day >= 61) {
    return 'rgba(52, 152, 219,0.5)'
  }
  if (day <= 6) {
    return 'rgba(192, 57, 43,0.5)'
  } else return 'rgba(211, 84, 0,0.5)'
}
