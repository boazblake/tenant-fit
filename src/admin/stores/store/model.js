import Task from 'data.task'
import { compose, map, identity } from 'ramda'
import { log } from 'utilities'


export const get = http => id =>
  http.get(`https://buxy-proxy.herokuapp.com/stores/${id}`)

export const getTask = http => id =>
  new Task((rej, res) => get(http)(id).then(res, rej))

export const getStoreTask = id =>
  compose(map(identity(dto => JSON.parse(dto.response))), getTask(id))