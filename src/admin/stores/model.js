import Task from 'data.task'
import {assoc, compose, map, chain, identity, prop, props, reverse, values, join, toLower, sortBy, filterBy, filter, test, toString } from 'ramda'
import { parse, eitherToTask, log } from 'utilities'

export const toViewModel = Dto => {
  let dto =
    { name: Dto.Name
    , leaseExpDate: Dto.LeaseExpirationDate
    , leaseNotifDate: Dto.LeaseNotificationDate
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

export const getStores = http => id =>
  http.get(`http://localhost:8080/admin/${id}/allstores`, id)
  // http.get(`http://localhost:8080/admin/${id}/allStores`)

export const getStoresTask = http => id =>
  new Task((rej, res) => getStores(http)(id).then(res, rej))

export const loadTask = http =>
  compose(map(map(addTerms)), map(map(toViewModel)), chain(eitherToTask), map(parse), getStoresTask(http))

  // ==========================================================================//

export const sortTask = p =>
  compose(Task.of,
      sortBy(compose(toLower, toString, prop(p)))
    )

export const searchTask = query =>
  compose(Task.of, filter(byTerms(query)))

export const directionTask = dir =>
  compose(Task.of, dir == 'asc' ? identity : reverse, log('dir'))

export const filterTask = p =>
    compose(Task.of, log('porps??'), filterBy(compose(toLower, toString, prop(p))), log('???'))

  // ==========================================================================//
export const filterConfirmed = filterable => x =>
  x[filterable] !== true

export const filtered = filterable => stores =>
  filter(filterConfirmed(filterable), stores)

export const filterStores = filterable => stores =>
  filtered(filterable)(stores)

  // ==========================================================================//
