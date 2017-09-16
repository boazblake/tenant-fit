import {PLATFORM} from 'aurelia-pal';
import { useView, inject } from 'aurelia-framework'
import {Router} from 'aurelia-router'
import { log } from 'utilities'

export const CheckAuth =
  { auth: () => sessionStorage.userId ? true : false
  , isAdmin: () => sessionStorage.isAdmin ? sessionStorage.isAdmin : sessionStorage.isAdmin //admin check
  , userId: () => sessionStorage.userId ? JSON.parse(sessionStorage.userId) : false //client side
  , adminId: () => sessionStorage.adminId ? JSON.parse(sessionStorage.adminId) : false //admin side - admin user
  , clientId: () => sessionStorage.clientId ? JSON.parse(sessionStorage.clientId) : false // admin side - client id for new store
  , clientName: () => sessionStorage.clientName ? JSON.parse(sessionStorage.clientName) : false // admin side - client id for new store
  , tenantId: () => sessionStorage.tenantId ? JSON.parse(sessionStorage.tenantId) : false //admin side  - tenant Id for new store
  , tenantName: () => sessionStorage.tenantName ? JSON.parse(sessionStorage.tenantName) : false //admin side  - tenant Id for new store
  , storeId: () => sessionStorage.storeId ? JSON.parse(sessionStorage.storeId) : false //admin side  - store Id for new store
  , userName: () => sessionStorage.userName ? JSON.parse(sessionStorage.userName) : false //admin side  - store Id for new store
  }