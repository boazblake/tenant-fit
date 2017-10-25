import { EventAggregator } from 'aurelia-event-aggregator'
import { bindable, inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'
import { HttpClient } from 'aurelia-http-client'
import { clone, chain, equals, tap } from 'ramda'
import { loadTask, toDestinationTask, getchangeColor } from './model'
import { validateTask } from './validations'
import styles from './styles.css'
import { CheckAuth } from 'authConfig'
import { log } from 'utilities'

@inject(HttpClient, EventAggregator, Router)
export class UserPage {
  constructor( http, emitter, router) {
    this.disposables = new Set()
    this.state = {}
    this.data = {}
    this.http = http
    this.emitter = emitter
    this.styles = styles
    this.router = router
  }

  activate(userId){
    this.reset()
    this.userId = userId.id
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
        c.emitter.publish('notify-warning', user.msg)
        return this.router.navigateToRoute('users');
      }
      c.data.user = user
      c.state.user = clone(c.data.user)
      c.emitter.publish('notify-success', `${user.name} was successfuly updated`)
    }

    validateTask(this.state.user)(this.data.user)(this.isRemovable)//.bimap(tap(onError(this)), tap(onSuccess(this)))
      .chain(toDestinationTask(this.http)(this.adminId)(this.userId))
        .fork(onError(this), onSuccess(this))
  }

  detached() {
    this.disposables.forEach(x => x.dispose())
  }

  reset() {
    this.isRemovable = false
    this.isEditable = false
    this.isDisabled = true
  }
}