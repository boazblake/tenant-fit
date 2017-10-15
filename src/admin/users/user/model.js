import Task from 'data.task'
import { assoc, compose, clone, chain, identity, map, prop, props, range, values } from 'ramda'
import { eitherToTask, log, parse } from 'utilities'
import moment from 'moment'

export const parseDate = date =>
  moment.utc(date)

export const toUserModel = Dto => {
  let dto =
    { isAdmin: Dto.IsAdmin
    , name: Dto.Name
    , _id: Dto._id
    }

  return dto
}

// =================================GET USER==========================================================
export const getUser = http => id =>
  http.get(`http://localhost:8080/users/${id}`)

export const getUserTask = http => id =>
  new Task((rej, res) => getUser(http)(id).then(res, rej))

export const loadTask = http =>
  compose(map(toUserModel),chain(eitherToTask), map(parse), getUserTask(http))
