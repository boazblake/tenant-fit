import Task from 'data.task'
import { chain, compose, map } from 'ramda'
import { parse, eitherToTask } from 'utilities'
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
export const get = http => id =>
  http.get(`https://buxy-proxy.herokuapp.com/users/${id}`)

export const getTask = http => id =>
  new Task((rej, res) => get(http)(id).then(res, rej))

export const loadTask = http =>
  compose(map(toViewModel), chain(eitherToTask), map(parse), getTask(http))

// COLOR USER===============================================================================
export const getChangeColor = bool => (bool ? 'red' : '')
