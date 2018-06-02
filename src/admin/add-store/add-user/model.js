import Task from 'data.task'
import { chain, compose, map } from 'ramda'
import { eitherToTask, parse } from 'utilities'

export const toViewModel = dto => ({
  id: dto._id,
  name: dto.Name,
  email: dto.email,
  cellphone: parseInt(dto.CellPhone)
})

export const toRequest = userId => dto => ({
  Name: dto.name,
  email: dto.email,
  CellPhone: dto.cellphone,
  ModifiedBy: userId
})

export const users = http =>
  http.get(`https://buxy-proxy.herokuapp.com/users/allusers`)

export const usersTask = http =>
  new Task((rej, res) => users(http).then(res, rej))

export const loadTask = compose(
  map(map(toViewModel)),
  chain(eitherToTask),
  map(parse),
  usersTask
)

// ===REGISTER USER============================================================
export const add = http => data =>
  http.post(`https://buxy-proxy.herokuapp.com/auth/register`, data)

export const addTask = http => data =>
  new Task((rej, res) => add(http)(data).then(res, rej))

export const registerTask = http => userId =>
  compose(
    map(toViewModel),
    chain(eitherToTask),
    map(parse),
    addTask(http),
    toRequest(userId)
  )
