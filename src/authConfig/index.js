import {PLATFORM} from 'aurelia-pal';
import { useView, inject } from 'aurelia-framework'
import {Router} from 'aurelia-router'
import { log } from 'utilities'

export const CheckAuth =
  { auth: () => sessionStorage.userId ? true : false
  , isAdmin: () => sessionStorage.isAdmin ? sessionStorage.isAdmin : sessionStorage.isAdmin 
  , userId: () => sessionStorage.userId ? JSON.parse(sessionStorage.userId) : false
  }
