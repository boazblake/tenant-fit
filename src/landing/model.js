import Task from 'data.task'
import { compose, map, lensProp, identity } from 'ramda'
import { log } from 'utilities'
import { tagged } from 'daggy'

// =====MODELS================================================================
export const userModel = dto =>
  ({ email:dto.email
  , password: dto.password
  , isAdmin: dto.isAdmin
  })

export const toVm = dto =>
  ({ id:dto.Id
  , isAdmin: dto.IsAdmin
  , name: dto.UserName
  })

  // =====LOGIN================================================================
export const loginUser = http => data => http.post("http://localhost:8080/auth/login", data)

export const loginUserTask = http => data =>
  new Task((rej, res) => loginUser(http)(data).then(res, rej))


export const loginTask = http =>
  compose(map(map(toVm)),map(map(identity(x => JSON.parse(x.response)))),loginUserTask)(http)