import Task from 'data.task'
import { compose, map, identity } from 'ramda'
import { log } from 'utilities'

export const toVm = Dto => {
  let dto =
    { name: Dto.Name
    , isAdmin: Dto.IsAdmin
    , _id: Dto._id
    }

  return dto
}

export const get = http => id =>
  http.get(`http://localhost:8080/admin/${id}/allusers`, id)

export const getTask = http => id =>
  new Task((rej, res) => get(http)(id).then(res, rej))

export const getUsersTask = http =>
  compose(map(map(toVm)), map(identity(dto => JSON.parse(dto.response))), getTask(http))