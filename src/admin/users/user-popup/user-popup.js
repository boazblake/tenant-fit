import { customElement, useView, inject, bindable, observable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogController } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getUserTask, updateUserTask, toggleVisibility } from './model'
import styles from './styles.css'
import { CheckAuth } from 'authConfig'
import { clone, equals } from 'ramda'

@customElement('user-popup')
@useView('./user-popup.html')
@inject(HttpClient, DialogController, EventAggregator)
export class UserPopup {
  @observable state
  constructor( http, dController, emitter) {
    this.disposables = new Set()
    this.dController = dController
    this.state = {}
    this.data = {}
    this.http = http
    this.emitter = emitter
    this.isEditable = false
    this.isDisabled = true
    this.isPassword = 'password'
    this.styles = styles
  }

  activate(userId){
    this.userId = userId
    this.adminId = CheckAuth.adminId()
  }

  stateChanged(newValue, oldValue){
    console.log(newValue, oldValue)
  }

  togglePassword() {
    this.isPassword = toggleVisibility(this.isPassword)
  }

  attached() {
    const onError = error =>{
      console.error(error);
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = user => {
      this.data.user = user
      this.state.user = clone(this.data.user)
    }

    getUserTask(this.http)(this.adminId)(this.userId).fork(onError, onSuccess)
  }

  editForm() {
    this.isDisabled = !this.isDisabled
    this.isEditable = !this.isEditable
  }

  validateUser() {
    equals(this.state.user, this.data.user)
      ? this.emitter.publish('notify-info', 'nothing to update')
      : this.updateUser(this.state.user._id)
  }

  updateUser() {
    const onError = error =>{
      console.error(error);
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = user => {
      this.data.user = user
      this.state.user = clone(this.data.user)
      this.emitter.publish('notify-success', `${user.name} was successfuly updated`)
      this.dController.ok(this.state.user)
    }

    updateUserTask(this.http)(this.adminId)(this.userId)(this.state.user).fork(onError, onSuccess)
  }



}