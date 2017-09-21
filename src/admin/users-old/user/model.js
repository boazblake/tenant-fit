import Task from 'data.task'
import { compose, map, identity } from 'ramda'
import { log } from 'utilities'

export const toVm = Dto => {
  let dto =
    { name: Dto.Name
    , _id: Dto._id
    }

  return dto
}

export const get = http => adminId => id =>
  http.get(`http://localhost:8080/admin/${adminId}/allusers/${id}`)

export const getTask = http => adminId => id =>
  new Task((rej, res) => get(http)(adminId)(id).then(res, rej))

export const getUserTask = adminId => id =>
  compose(map(toVm), map(identity(dto => JSON.parse(dto.response))), getTask(adminId)(id))