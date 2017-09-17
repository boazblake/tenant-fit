import Task from 'data.task'
import { compose, map, identity } from 'ramda'
import { log } from 'utilities'

export const passwordDic = {
  password: 'text',
  text: 'password'
}

export const toggleVisibility = label =>
  passwordDic[label]

export const toVm = Dto => {
  let dto =
    { name: Dto.Name
    // , landlordEntity: Dto.LandlordEntity
    , email: Dto.email
    , cellphone: Dto.CellPhone
    , workphone: Dto.WorkPhone
    , password: Dto.password
    , id: Dto._id
    // , comments: Dto.Comments
    // , tenantId: TenantId
    // , userId: ClientId
    }

  return dto
}

export const toRequest = adminId => dto => {
  let Dto =
    { Name: dto.name
    // , landlordEntity: dto.LandlordEntity
    , email: dto.email
    , CellPhone: dto.cellphone
    , WorkPhone: dto.workphone
    , password: dto.password
    , ModifiedBy: adminId
    // , comments: dto.Comments
    // , tenantId: TenantId
    // , userId: ClientId
    }

  return Dto
}


export const get = http => adminId => userId =>
  http.get(`https://buxy-proxy.herokuapp.com/admin/${adminId}/allusers/${userId}`)

export const getTask = http => adminId => userId =>
  new Task((rej, res) => get(http)(adminId)(userId).then(res, rej))

export const getUserTask = adminId => userId =>
compose(map(toVm), map(identity(dto => JSON.parse(dto.response))), getTask(adminId)(userId))



export const update = http => adminId => userId => dto =>
  http.put(`https://buxy-proxy.herokuapp.com/admin/${adminId}/allusers/${userId}`, dto)

export const updateTask = http => adminId => userId => dto =>
  new Task((rej, res) => update(http)(adminId)(userId)(dto).then(res, rej))

export const updateContactTask = http => adminId => userId =>
  compose(map(toVm), map(identity(dto => JSON.parse(dto.response))), map(log('data')), updateTask(http)(adminId)(userId),toRequest(adminId))