import { equals, compose, identity, prop, test } from 'ramda'
import { log, toTask } from 'utilities'


export const validateEmail = email =>
  test(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  ,email) ? email : {msg: 'error with email'}

export const validateName = x => identity(x)
export const validateCellphone = x => identity(x)
export const validatePassword = x => identity(x)
export const validateIsAdmin = x => identity(x)

export const toUserModel = dto => {
  const userModel =
    { email: validateEmail(prop('email', dto))
    , password: validatePassword(prop('password', dto))
    , name: validateName(prop('name', dto))
    , cellPhone: validateCellphone(prop('cellphone', dto))
    , isAdmin: validateIsAdmin(prop('isAdmin', dto))
    , _id: prop('_id', dto)
    }
  
  return userModel
}
  
export const compareStates = newState => oldState => {
  if ( equals(newState, oldState) ) {
    console.log('clean state')
    return {msg: 'nothing to update'}
  } else {
    console.log('dirty state')
    return toUserModel(newState)
  }
}

export const validateUserTask = newState =>
    compose(toTask ,compareStates(newState))
