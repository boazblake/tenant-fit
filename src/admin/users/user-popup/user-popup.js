import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogController } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getUserTask, toggleVisibility, updateContactTask } from './model'
import { style } from './style.css'
import { CheckAuth } from 'authConfig'

@customElement('user-popup')
@useView('./user-popup.html')
@inject(HttpClient, DialogController, EventAggregator)
export class UserPopup {
  constructor( http, dController, emitter) {
    this.disposables = new Set()
    this.dController = dController
    this.state = {}
    this.http = http
    this.style = style
    this.emitter = emitter
    this.isEditable = false
    this.isDisabled = true
    this.isPassword = 'password'
  }

  activate(clientId){
    this.clientId = clientId
    this.adminId = CheckAuth.adminId()
  }


  attached(params) {
    const onError = error =>{
      console.error(error);
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = user => {
      this.state.user = user
    }

    getUserTask(this.http)(this.adminId)(this.clientId).fork(onError, onSuccess)
  }

  togglePassword() {
    this.isPassword = toggleVisibility(this.isPassword)
  }

  editForm() {
    this.isDisabled = !this.isDisabled
    this.isEditable = !this.isEditable
  }

  updateContact() {
    const onError = error =>{
      console.error(error);
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = user => {
      this.state.user = user
      this.emitter.publish('notify-success', user.name)
    }

    updateContactTask(this.http)(this.adminId)(this.clientId)(this.state.user).fork(onError, onSuccess)
  }



}