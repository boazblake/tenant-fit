import Task from 'data.task'
import { compose } from 'ramda'

export const validate = dto => {
  let validation =
  dto
    ? dto
    : {msg: 'please select a tenant'}

  return validation
}

export const toTask = dto =>
  dto.msg
    ? Task.rejected(dto.msg)
    : Task.of(dto)

export const validateTenantTask =
  compose(toTask, validate )
