import { toTask } from 'utilities'
import { compose } from 'ramda'

export const validate = dto => {
  let validation =
  dto
    ? dto
    : {msg: 'please select or add a brand'}

  return validation
}

export const validateBrandTask =
  compose(toTask, validate )
