import Task from 'data.task'
import { compose, chain, identity, map } from 'ramda'
import { eitherToTask, log, parse } from 'utilities'

export const toViewModel = dto =>
  ({ id: dto._id
  , name: dto.Name
  , src: dto.logo
  })

export const toRequest = userId => brandUserId => dto =>{
  console.log(brandUserId)
  return ({ Name: dto.name
          , Logo: brandUserId
          , ModifiedBy: userId
          })
}

export const brands = http => id =>
  http.get(`http://localhost:8080/brands/userId/${id}`)

export const getBrands = http => id =>
  new Task((rej, res) => brands(http)(id).then(res, rej))

export const loadTask = http =>
  compose(map(map(toViewModel)),chain(eitherToTask), map(parse), getBrands(http))

export const add = http => data =>
  http.post(`http://localhost:8080/brands/add`, data)

export const addTask = http => data =>
  new Task( (rej, res) => add(http)(data).then(res, rej))

export const addBrandTask = http => userId =>
  // compose(map(toViewModel), map(identity(dto => JSON.parse(dto.response))), addTask(http), toRequest(userId)(brandUserId))
  compose(map(toViewModel),map(log('dto to create brand')),chain(eitherToTask), map(parse), addTask(http), toRequest(userId)(brandUserId))


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
  compose( map(log(';wtf')), map(map(toLogo)), chain(eitherToTask), map(parse), fetchLogo(http), toQuery)
