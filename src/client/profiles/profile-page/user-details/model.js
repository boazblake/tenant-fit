import Task from 'data.task'
import { compose, chain, map } from 'ramda'
import { eitherToTask, parse } from 'utilities'
import moment from 'moment'

export const parseDate = date => moment.utc(date)

export const toViewModel = Dto => {
  let dto = {
    email: Dto.email,
    isAdmin: Dto.IsAdmin,
    password: Dto.password,
    name: Dto.Name,
    cellPhone: Dto.CellPhone,
    _id: Dto._id
  }

  return dto
}

export const toDto = adminId => dto => {
  let Dto = {
    email: dto.email,
    IsAdmin: dto.isAdmin,
    password: dto.password,
    Name: dto.name,
    CellPhone: dto.cellPhone,
    _id: dto._id,
    ModifiedBy: adminId
  }

  return Dto
}

// GET USER===============================================================================
export const get = http => userId => adminId =>
  http.get(`https://buxy-proxy.herokuapp.com/users/${userId}`)

export const getTask = http => userId => adminId =>
  new Task((rej, res) => get(http)(userId)(adminId).then(res, rej))

export const loadTask = http => userId =>
  compose(
    map(toViewModel),
    chain(eitherToTask),
    map(parse),
    getTask(http)(userId)
  )

// UPDATE USER===============================================================================
export const update = http => adminId => userId => Dto =>
  http.put(`https://buxy-proxy.herokuapp.com/users/${userId}`, Dto)

export const updateTask = http => adminId => userId => Dto =>
  new Task((rej, res) => update(http)(adminId)(userId)(Dto).then(res, rej))

export const toSubmitTask = http => adminId => userId =>
  compose(
    map(toViewModel),
    chain(eitherToTask),
    map(parse),
    updateTask(http)(adminId)(userId),
    toDto(adminId)
  )

// DELETE USER===============================================================================

export const remove = http => adminId => userId =>
  http.delete(`https://buxy-proxy.herokuapp.com/users/${userId}`)

export const removeTask = http => adminId => userId =>
  new Task((rej, res) => remove(http)(adminId)(userId).then(res, rej))

export const toRemoveTask = http => adminId =>
  compose(chain(eitherToTask), map(parse), removeTask(http)(adminId))

// DESTINATION USER===============================================================================

export const checkDto = http => adminId => userId => dto =>
  dto.toRemove
    ? toRemoveTask(http)(adminId)(userId)
    : toSubmitTask(http)(adminId)(userId)(dto)

export const toDestinationTask = http => adminId => userId =>
  compose(checkDto(http)(adminId)(userId))

// COLOR USER===============================================================================
export const getChangeColor = bool => (bool ? 'red' : '')
