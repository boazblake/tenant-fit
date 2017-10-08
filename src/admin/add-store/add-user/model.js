import Task from 'data.task'
import { chain, compose, identity, map } from 'ramda'
import { eitherToTask, parse } from 'utilities'

export const toViewModel = dto =>
  ({ id: dto._id
  , name: dto.Name
  , email:  dto.email
  , cellphone:  parseInt(dto.CellPhone)
  })

export const toRequest = userId => dto =>
  ({ Name: dto.name
  , email:  dto.email
  , CellPhone:  dto.cellphone
  , ModifiedBy: userId
  })

export const users = http => id =>
  http.get(`http://localhost:8080/admin/${id}/allusers`)

export const usersTask = http => id =>
  new Task((rej, res) => users(http)(id).then(res, rej))

export const loadTask = http =>
  compose(map(map(toViewModel)),chain(eitherToTask), map(parse), usersTask(http))

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
  compose(toTask, validate )


  // ===REGISTER USER============================================================
export const add = http => data =>
  http.post(`http://localhost:8080/auth/register`, data)

export const addTask = http => data =>
  new Task( (rej, res) => add(http)(data).then(res, rej))

export const registerTask = http => userId =>
     compose( map(toViewModel), chain(eitherToTask), map(parse), addTask(http), toRequest(userId))
