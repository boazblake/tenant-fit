import Task from 'data.task'
import { compose, chain, map } from 'ramda'
import { eitherToTask, parse } from 'utilities'
import moment from 'moment'

export const parseDate = date => moment.utc(date)

export const toUserModel = Dto => {
  let dto = {
    isAdmin: Dto.IsAdmin,
    name: Dto.Name,
    _id: Dto._id
  }

  return dto
}

// =================================GET USER==========================================================
export const getUser = http => userId => adminId =>
  http.get(`https://buxy-proxy.herokuapp.com/users/${userId}`)

export const getUserTask = http => userId => adminId =>
  new Task((rej, res) => getUser(http)(userId)(adminId).then(res, rej))

export const loadTask = http => userId =>
  compose(
    map(toUserModel),
    chain(eitherToTask),
    map(parse),
    getUserTask(http)(userId)
  )
