import Task from 'data.task'
import { compose, identity, map } from 'ramda'
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

// GET USER===============================================================================
export const get = http => id => http.get(`http://localhost:8080/users/${id}`)

export const getTask = http => id =>
  new Task((rej, res) => get(http)(id).then(res, rej))

export const loadTask = http =>
  compose(
    map(toViewModel),
    map(identity(dto => JSON.parse(dto.response))),
    getTask(http)
  )

// COLOR USER===============================================================================
export const getChangeColor = bool => (bool ? 'red' : '')
