import Task from 'data.task'
import { compose, map, identity } from 'ramda'
import { log } from 'utilities'

export const tenants = http => id =>
  http.get(`https://buxy-proxy.herokuapp.com/tenants/${id}`)

export const getTenants = http => id =>
  new Task((rej, res) => tenants(http)(id).then(res, rej))

export const getTenantsTask = id =>
  compose(map(identity(dto => JSON.parse(dto.response))), getTenants(id))

////////////////////////////////////////////////////////////////////////////
export const add = type => http => data =>
  http.post(`https://buxy-proxy.herokuapp.com/${type}/add/`, data)

export const addTask = type => http => data =>
  new Task( (rej, res) => add(type)(http)(data).then(res, rej))

export const addTypeTask = type => http => data =>
  compose(map(identity(dto => JSON.parse(dto.response))), addTask(type)(http))
  // compose(console.log('type', type, 'http', http, 'id', id, 'data',data))
  //
  //
  // 