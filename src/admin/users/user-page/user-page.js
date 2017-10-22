import { DialogController, DialogService } from 'aurelia-dialog'
import { EventAggregator } from 'aurelia-event-aggregator'
import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { clone, chain, equals, tap } from 'ramda'
import { loadTask, toDestinationTask, getRemoveColor } from './model'
import { validateUserTask } from './validations'
import styles from './styles.css'
import Delete from 'components'
import { CheckAuth } from 'authConfig'
import { log } from 'utilities'

@inject(HttpClient, DialogController, DialogService, EventAggregator, Delete)
export class UserPage {
  constructor( http, dController, modal, emitter) {
    this.disposables = new Set()
    this.dController = dController
    this.modal = modal
    this.state = {}
    this.data = {}
    this.http = http
    this.emitter = emitter
    this.styles = styles
  }

  bind() {
    this.reset()
  }

  activate(userId){
    this.userId = userId
    this.adminId = CheckAuth.adminId()
  }

  attached() {
    this.load()
  }

  load() {
    const onError = c => error =>{
      console.error(error);
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = c => user => {
      this.data.user = user
      this.state.user = clone(this.data.user)
    }

    loadTask(this.http)(this.userId)
      .fork(onError(this), onSuccess(this))
  }

  editForm() {
    this.isDisabled = !this.isDisabled
    this.isEditable = !this.isEditable
  }

  submit() {
    const onError = c => error => {
      if (error.msg) return c.emitter.publish('notify-error', error.msg)
      c.emitter.publish('notify-error', error.response)
    }

    const onSuccess = c => user => {
      if (user.msg) {
        c.dController.ok(user)
        return c.emitter.publish('notify-warning', user.msg)
      }
      c.data.user = user
      c.state.user = clone(c.data.user)
      c.emitter.publish('notify-success', `${user.name} was successfuly updated`)
      c.dController.ok(c.state.user)
    }

    validateTask(this.state.user)(this.data.user)(this.toRemove)//.bimap(tap(onError(this)), tap(onSuccess(this)))
      .chain(toDestinationTask(this.http)(this.adminId)(this.userId))
        .fork(onError(this), onSuccess(this))
  }

  background() { 
    this.removeColor = getRemoveColor(this.toRemove)
  }

  highlight() {
    this.isRemovable = confirm(`Are you sure? \n WARNING \n On Submission, this will delete all data associated with ${this.state.user.name}`)
    this.toRemove = this.isRemovable ? !this.toRemove : this.toRemove
    this.background()
  }

  detached() {
    this.disposables.forEach(x => x.dispose())
  }

  reset() {
    this.isRemovable = false
    this.toRemove = false
    this.isEditable = false
    this.isDisabled = true
    this.background()
  }
}