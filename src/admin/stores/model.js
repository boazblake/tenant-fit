import Task from 'data.task'
import {assoc, compose, map, chain, identity, prop, props, reverse, values, join, toLower, sortBy, filterBy, filter, test, toString } from 'ramda'
import { parse, eitherToTask, log } from 'utilities'

export const toViewModel = Dto => {
  let dto =
    { name: Dto.Name
    , leaseExpDate: Dto.LeaseExpirationDate
    , leaseNotifDate: Dto.LeaseNotificationDate
    , propertyName: Dto.PropertyName
    , isConfirmed: Dto.IsConfirmed
    , _id: Dto._id
    }
  return dto
}

export const byTerms = query =>
  compose(test(new RegExp(query, 'i')), prop('name'))

export const addTerms = item => {
  const terms = compose(join(' '), values, props(['name']))(item)
  return assoc('_terms', terms, item)
}

export const getStores = http =>
  http.get(`http://localhost:8080/stores`)

export const getStoresTask = http =>
  new Task((rej, res) => getStores(http).then(res, rej))

export const loadTask =
  compose(map(map(addTerms)), map(map(toViewModel)), chain(eitherToTask), map(parse), getStoresTask)

  // ==========================================================================//

export const sortTask = p =>
  compose(Task.of, sortBy(compose(toLower, toString, prop(p))))

export const searchTask = query =>
  compose(Task.of, filter(byTerms(query)))

export const directionTask = dir =>
  compose(Task.of, dir === 'asc' ? identity : reverse)

  // ==========================================================================//
export const filterUnConfirmed = filterable => x =>{
  if (toString(filterable) === '') {
    return x
  }
  return x[filterable] !== true
}

export const filtered = filterable => xs =>
  filter(filterUnConfirmed(filterable), xs)

export const filterTask = filterable =>
  compose(Task.of, filtered(filterable))
