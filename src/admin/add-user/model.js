import Task from 'data.task'
import { compose, map, identity } from 'ramda'
import { log } from 'utilities'

export const userModel = dto =>
  dto

export const toVm = dto =>
  ({ id: dto._id
  , name: dto.Name
  })

export const toRequest = dto =>
  ({ Name: dto.name
  , email:  dto.email
  , Cellphone:  dto.cellphone
  , Workphone:  dto.workphone
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
  dto.selectedUser
    ? (dto.addUser && dto.addUser.name)
      ? {msg: 'please select one and leave the other blank'}
      : dto.selectedUser
    : dto.addUser
      ? dto.addUser
      : {msg: 'please select a user'}

  return validation
}

export const toTask = dto =>
  dto.msg
    ? Task.rejected(dto.msg)
    : Task.of(dto)

export const validateUserTask =
  compose(map(log('state')), toTask, validate )


  // ===REGISTER USER============================================================
export const add = http => data =>
  http.post(`http://localhost:8080/admin/addCustomer/`, data)

export const addTask = http => data =>
  new Task( (rej, res) => add(http)(data).then(res, rej))

export const registerTask = http =>
  compose(map(identity(dto => JSON.parse(dto.response))), addTask(http), log('data?'),toRequest)
  // compose(console.log('type', type, 'http', http, 'id', id, 'data',data))