import Task from 'data.task'
import {
  assoc,
  compose,
  map,
  chain,
  identity,
  prop,
  props,
  reverse,
  values,
  join,
  toLower,
  sortBy,
  filter,
  test,
  toString
} from 'ramda'
import { parse, eitherToTask } from 'utilities'

export const toViewModel = Dto => {
  let dto = {
    name: Dto.Name,
    isAdmin: Dto.IsAdmin,
    _id: Dto._id
  }
  return dto
}

export const byTerms = query =>
  compose(test(new RegExp(query, 'i')), prop('name'))

export const addTerms = item => {
  const terms = compose(join(' '), values, props(['name']))(item)
  return assoc('_terms', terms, item)
}

export const getUsers = http => adminId =>
  http.get(`https://buxy-proxy.herokuapp.com/users`)

export const getUsersTask = http => adminId =>
  new Task((rej, res) => getUsers(http)(adminId).then(res, rej))

export const loadTask = http =>
  compose(
    map(map(addTerms)),
    map(map(toViewModel)),
    chain(eitherToTask),
    map(parse),
    getUsersTask(http)
  )

// ==========================================================================//

export const sortTask = p =>
  compose(Task.of, sortBy(compose(toLower, toString, prop(p))))

export const searchTask = query => compose(Task.of, filter(byTerms(query)))

export const directionTask = dir =>
  compose(Task.of, dir === 'asc' ? identity : reverse)

// ==========================================================================//
export const filterAdmins = filterable => x => {
  if (filterable.length === 0) {
    return x
  }
  return x[filterable] === true
}

export const filtered = filterable => xs => filter(filterAdmins(filterable), xs)

export const filterTask = filterable => compose(Task.of, filtered(filterable))
