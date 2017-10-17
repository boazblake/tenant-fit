import Task from 'data.task'
import { assoc, compose, clone, chain, identity, map, prop, props, range, values } from 'ramda'
import { eitherToTask, log, parse } from 'utilities'
import moment from 'moment'

export const parseDate = date =>
  moment.utc(date)

export const dirtyState = oldStore => {
  console.log(oldStore)
}


export const toVm = Dto => {
  console.log('from mongo', Dto)
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


// GET STORE===============================================================================
export const get = http => id =>
  http.get(`http://localhost:8080/users/${id}`)

export const getTask = http => id =>
  new Task((rej, res) => get(http)(id).then(res, rej))

export const getUserTask = http =>
  compose(map(toVm),map(identity(dto => JSON.parse(dto.response))),  getTask(http))



  // UPDATE STORE===============================================================================
export const update = http => adminId => userId => Dto =>
  http.put(`http://localhost:8080/users/${userId}`, Dto)

export const updateUser = http => adminId => userId => Dto =>
  new Task((rej, res) => update(http)(adminId)(userId)(Dto).then(res, rej))

export const updateUserTask = http => adminId => userId =>
  compose( map(toVm),  map(identity(Dto => JSON.parse(Dto.response))), updateUser(http)(adminId)(userId), toDto(adminId))
  // compose(map(toViewModel(storeDto)), chain(eitherToTask), map(parse), getLogoTask(http))(storeDto)
