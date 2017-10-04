import Task from 'data.task'
import { compose, clone, chain, identity, map, range, values } from 'ramda'
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



const colorRange =
  { 'rgba(52, 152, 219,1.0)': range(61, 91)
  , 'rgba(39, 174, 96,1.0)': range(31, 61)
  , 'rgba(230, 126, 34,1.0)': range(11, 31)
  , 'rgba(211, 84, 0,1.0)': range(6, 11)
  , 'rgba(192, 57, 43,1.0)': range(1,6)
  }

const findDate = day => dateRange =>{
    log('dateRange')(dateRange)
    log('day')(day)
    log('colorRange')(colorRange)
    const array = dateRange.map(x => x.includes(day))
    log('array')(array)
}

const compareDates = dateRange => day =>
  compose(log('info?????'), findDate(day), values)(dateRange)

export const findColor = day => {
  console.log('day is ', day)
  if (day >= 61) {return 'rgba(52, 152, 219,0.3)'}
  if (day <= 6) {return 'rgba(192, 57, 43,0.3)'}
   else return 'rgba(211, 84, 0,0.3)'
}
