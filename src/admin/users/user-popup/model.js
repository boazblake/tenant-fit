import Task from 'data.task'
import { assoc, compose, clone, chain, identity, map, prop, props, range, values } from 'ramda'
import { eitherToTask, log, parse } from 'utilities'
import moment from 'moment'

export const parseDate = date =>
  moment.utc(date)

export const toViewModel = Dto => {
  let dto =
    { email: Dto.email
    , isAdmin: Dto.IsAdmin
    , password: Dto.password
    , name: Dto.Name
    , cellPhone: Dto.CellPhone
    , _id: Dto._id
    }

  return dto
}


export const toDto = adminId => dto => {
  let Dto =
    { email: dto.email
    , IsAdmin: dto.isAdmin
    , password: dto.password
    , Name: dto.name
    , CellPhone: dto.cellPhone
    , _id: dto._id
    }

  return Dto
}


// GET USER===============================================================================
export const get = http => id =>
  http.get(`http://localhost:8080/users/${id}`)

export const getTask = http => id =>
  new Task((rej, res) => get(http)(id).then(res, rej))

export const getUserTask = http =>
  compose(map(toViewModel),map(identity(dto => JSON.parse(dto.response))),  getTask(http))

// UPDATE USER===============================================================================
export const update = http => adminId => userId => Dto =>
  http.put(`http://localhost:8080/users/${userId}`, Dto)

export const updateUser = http => adminId => userId => Dto =>
  new Task((rej, res) => update(http)(adminId)(userId)(Dto).then(res, rej))


export const submitUserTask = http => adminId => userId =>
  compose(map(toViewModel), chain(eitherToTask), map(parse), updateUser(http)(adminId)(userId), toDto(adminId))


// DESTINATION USER===============================================================================

export const toDelete = http => adminId => userId =>
  http.delete(`http://localhost:8080/users/${userId}`)

export const deleteUser = http => adminId => userId =>
  new Task((rej, res) => toDelete(http)(adminId)(userId).then(res, rej))


export const deleteUserTask = http => adminId =>
  compose(chain(eitherToTask), map(parse), deleteUser(http)(adminId))


// DESTINATION USER===============================================================================

export const checkDto = http => adminId => userId => dto =>
  dto.toRemove ? deleteUserTask(http)(adminId)(userId) : submitUserTask(http)(adminId)(userId)(dto)


export const toDestinationTask = http => adminId => userId =>
  compose( checkDto(http)(adminId)(userId) )
  

// COLOR USER===============================================================================
export const getRemoveColor = bool =>
  bool ? 'red' : ''