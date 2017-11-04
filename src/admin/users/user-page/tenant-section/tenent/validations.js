import { equals, compose, identity, prop, trim } from 'ramda'
import { toTask } from 'utilities'

export const validateName = x => identity(trim(x))

export const toModel = (dto, isRemovable) => {
  const model = {
    name: validateName(prop('name', dto)),
    _id: prop('_id', dto),
    toRemove: isRemovable
  }

  return model
}

export const compareStates = newState => oldState => isRemovable => {
  console.log('isRemovble', isRemovable)
  if (equals(newState, oldState) && !isRemovable) {
    return { msg: 'nothing to update' }
  } else {
    return toModel(newState, isRemovable)
  }
}

export const validateTask = newState => oldState =>
  compose(toTask, compareStates(newState)(oldState))
