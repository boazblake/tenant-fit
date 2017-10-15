import Task from 'data.task'
import { compose, chain, identity, map } from 'ramda'
import { eitherToTask, log, parse } from 'utilities'

export const toViewModel = dto =>
  ({ id: dto._id
  , name: dto.Name
  , logo: dto.Logo
  })

export const toRequest = userId => dto =>{
  return ({ Name: dto.name
          , Logo: dto.logo
          , ModifiedBy: userId
          })
}

export const brands = http =>
  http.get(`http://localhost:8080/brands/`)

export const getBrands = http =>
  new Task((rej, res) => brands(http).then(res, rej))

export const loadTask =
  compose(map(map(toViewModel)),chain(eitherToTask), map(parse), getBrands)

//////////////////////////////////////////////////////////////////////////////////////


export const add = http => data =>
  http.post(`http://localhost:8080/brands/add`, data)

export const addTask = http => data =>
  new Task( (rej, res) => add(http)(data).then(res, rej))

export const addBrandTask = http => userId =>
  compose(map(toViewModel),chain(eitherToTask), map(parse), addTask(http), toRequest(userId))


///////////////////////////////////////////////////////////////////////////////

export const toQuery = q =>
  q.split(' ').join('')

export const toLogo = dto =>
  ({ logo: dto.logo
  ,  name: dto.name
  })

export const logo = http => query =>
  http.get(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${query}`)

export const fetchLogo = http => query =>
  new Task((rej, res) => logo(http)(query).then(res, rej))

export const fetchLogoTask = http =>
  compose(map(map(toLogo)), chain(eitherToTask), map(parse), fetchLogo(http), toQuery)
