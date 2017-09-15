import Task from 'data.task'
import { compose, map, identity } from 'ramda'
import { log } from 'utilities'

export const toVm = dto =>
  ({ id: dto._id
  , name: dto.Name
  })

export const users = http => id =>
  http.get(`http://localhost:8080/admin/${id}/allusers`)

export const getUsers = http => id =>
  new Task((rej, res) => users(http)(id).then(res, rej))

export const getUsersTask = id =>
  compose(map(map(toVm)), map(identity(dto => JSON.parse(dto.response))), getUsers(id))

// ===VALIDATE USER============================================================
export const validate = dto => {
  let validation =
  (dto.addUser && dto.selectedUser)
    ? {msg: 'please select one and leave the other blank'}
    : dto.addUser
      ? dto.addUser
      : dto.selectedUser
        ? dto.selectedUser
        : {msg: 'please select a user'}

  return validation
}

export const toTask = dto =>
  dto.msg
    ? Task.rejected(dto.msg)
    : Task.of(dto)

export const validateUserTask =
  compose(map(log('state')), toTask, validate )


////////////////////////////////////////////////////////////////////////////
export const add = type => http => data =>
  http.post(`http://localhost:8080/${type}/add/`, data)

export const addTask = type => http => data =>
  new Task( (rej, res) => add(type)(http)(data).then(res, rej))

export const addTypeTask = type => http => data =>
  compose(map(identity(dto => JSON.parse(dto.response))), addTask(type)(http))
  // compose(console.log('type', type, 'http', http, 'id', id, 'data',data))