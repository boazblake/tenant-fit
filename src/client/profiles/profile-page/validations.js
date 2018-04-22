import { equals, compose, identity, prop, test, trim } from 'ramda'
import { log, toTask } from 'utilities'


export const validateEmail = email =>
  test(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  ,trim(email)) ? trim(email) : {msg: `error with email ${email}`}

export const validateName = x => identity(trim(x))
export const validateCellphone = x => identity(trim(x))
export const validatePassword = x => x ? identity(trim(x)) : identity(x)
export const validateIsAdmin = x => identity(x)

export const toModel = (dto, isRemovable) => {
  const model =
    { email: validateEmail(prop('email', dto))
    , password: validatePassword(prop('password', dto))
    , name: validateName(prop('name', dto))
    , cellPhone: validateCellphone(prop('cellPhone', dto))
    , isAdmin: validateIsAdmin(prop('isAdmin', dto))
    , _id: prop('_id', dto)
    , toRemove:isRemovable
    }
  
  return model
}
  
export const compareStates = newState => oldState => isRemovable => {
  if ( equals(newState, oldState) && ! isRemovable ) {
    return {msg: 'nothing to update'}
  } else {
    return toModel(newState, isRemovable)
  }
}

export const validateTask = newState => oldState =>
    compose(toTask, compareStates(newState)(oldState))
