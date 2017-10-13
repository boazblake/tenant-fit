import Task from 'data.task'
import { compose } from 'ramda'

export const validate = dto => {
  let validation =
  dto
    ? dto
    : {msg: 'please select or add a brand'}

  return validation
}

export const toTask = dto =>
  dto.msg
    ? Task.rejected(dto.msg)
    : Task.of(dto)

export const validateBrandTask =
  compose(toTask, validate )
