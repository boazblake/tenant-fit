import { DialogController } from 'aurelia-dialog'
import { EventAggregator } from 'aurelia-event-aggregator'
import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { clone, chain, equals } from 'ramda'
import { getUserTask, updateUserTask } from './model'
import { validateUserTask } from './validations'
import styles from './styles.css'
import { CheckAuth } from 'authConfig'

@inject(HttpClient, DialogController, EventAggregator)
export class UserPopup {
  constructor( http, dController, emitter) {
    this.disposables = new Set()
    this.dController = dController
    this.state = {}
    this.data = {}
    this.http = http
    this.emitter = emitter
    this.isEditable = false
    this.isDisabled = true
    this.styles = styles
  }

  activate(userId){
    this.userId = userId
    this.adminId = CheckAuth.adminId()
  }

  attached() {
    const onError = c => error =>{
      console.error(error);
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = c => user => {
      this.data.user = user
      this.state.user = clone(this.data.user)
    }

    getUserTask(this.http)(this.userId)
      .fork(onError(this), onSuccess(this))
  }

  editForm() {
    this.isDisabled = !this.isDisabled
    this.isEditable = !this.isEditable
  }

  update() {
    const onError = c => error => {
      c.emitter.publish('notify-error', error.response)
    }

    const onSuccess = c => user => {
      c.data.user = user
      c.state.user = clone(c.data.user)
      c.emitter.publish('notify-success', `${user.name} was successfuly updated`)
      c.dController.ok(c.state.user)
    }

    validateUserTask(this.state.user)(this.data.user)
      .chain(updateUserTask(this.http)(this.adminId)(this.userId))
        .fork(onError(this), onSuccess(this))
  }
}