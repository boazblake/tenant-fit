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


// =====REGISTER================================================================

export const registerUser = http => data =>
  http.post("http://localhost:8080/auth/register",data)


export const registerUserTask = http => data =>
  new Task((rej, res) => registerUser(http)(data).then(res, rej))

export const registerTask = http =>
  compose(map(map(identity(x => JSON.parse(x.response)))),registerUserTask)(http)


  // =====LOGIN================================================================
export const loginUser = http => data => http.post("http://localhost:8080/auth/login", data)

export const loginUserTask = http => data =>
  new Task((rej, res) => loginUser(http)(data).then(res, rej))


export const loginTask = http =>
  compose(map(map(identity(x => JSON.parse(x.response)))),loginUserTask)(http)
