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
export class UserDetails {
  @bindable userId
  @bindable adminId
  @bindable isRemovable

  constructor(http, emitter, router) {
    this.disposables = new Set()
    this.state = {}
    this.data = {}
    this.http = http
    this.emitter = emitter
    this.styles = styles
    this.router = router
  }

  activate() {}

  attached() {
    this.reset()
    this.listen()
    this.load()
  }

  listen() {
    const editFormHandler = c => msg => this.editForm(c, msg)
    const submitFormHandler = c => msg => this.submit(c, msg)
    const deleteFormHandler = c => msg => this.editForm(c, msg)

    this.disposables.add(
      this.emitter.subscribe('edit-form-channel', editFormHandler(this))
    )
    this.disposables.add(
      this.emitter.subscribe('user-submit-channel', submitFormHandler(this))
    )
    this.disposables.add(
      this.emitter.subscribe('delete-user-channel', deleteFormHandler(this))
    )
  }

  load() {
    const onError = c => error => {
      console.error(error)
      c.emitter.publish('notify-error', error.response)
    }

    const onSuccess = c => user => {
      c.data.user = user
      c.state.user = clone(c.data.user)
    }
    loadTask(this.http)(this.userId).fork(onError(this), onSuccess(this))
  }

  editForm(c, { isDisabled, isEditable }) {
    c.isDisabled = isDisabled
    c.isEditable = isEditable
  }

  submit(c, _) {
    const onError = c => error => {
      if (error.msg) return c.emitter.publish('notify-error', error.msg)
      c.emitter.publish('notify-error', error.response)
    }

    const onSuccess = c => user => {
      if (user.msg) {
        c.emitter.publish('notify-warning', user.msg)
        return this.router.navigateToRoute('users')
      }
      c.data.user = user
      c.state.user = clone(c.data.user)
      c.emitter.publish(
        'notify-success',
        `${user.name} was successfuly updated`
      )
      return this.router.navigateToRoute('users')
    }

    validateTask(c.state.user)(c.data.user)(c.isRemovable) //.bimap(tap(onError(c)), tap(onSuccess(c)))
      .chain(toDestinationTask(c.http)(c.adminId)(c.userId))
      .fork(onError(c), onSuccess(c))
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
