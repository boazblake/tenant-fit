import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getUserTask } from './model'
import { style } from './style.css'
import { CheckAuth } from 'authConfig'

@customElement('user-popup')
@useView('./user-popup.html')
@inject(HttpClient, DialogController)
export class UserPopup {
  constructor( http, dController ) {
    this.disposables = new Set()
    this.dController = dController
    this.state = {}
    this.http = http
    this.style = style
  }

  activate(userId){
    this.userId = userId
    this.adminId = CheckAuth.adminId()
    console.log(this.adminId, this.userId)
  }


  attached(params) {
    const onError = error =>{
      console.error(error);
      this.emitter.publish('notify-error', error.response)
    }
    const onSuccess = data => {
      console.log('success', data)
      this.user = data
    }

    getUserTask(this.http)(this.adminId)(this.userId).fork(onError, onSuccess)
  }



}