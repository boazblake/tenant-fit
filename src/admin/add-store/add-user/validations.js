import Task from 'data.task'
import { compose } from 'ramda'

export const validate = dto => {
  let validation =
    dto ? dto : {msg: 'please select or add a client'}

  return validation
}

export const toTask = dto =>
  dto.msg
    ? Task.rejected(dto.msg)
    : Task.of(dto)


export const validateUserTask =
  compose(toTask, validate )
