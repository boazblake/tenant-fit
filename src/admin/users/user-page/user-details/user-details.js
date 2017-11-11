import { EventAggregator } from 'aurelia-event-aggregator'
import { bindable, inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'
import { HttpClient } from 'aurelia-http-client'
import { clone } from 'ramda'
import { loadTask, toDestinationTask } from './model'
import { validateTask } from './validations'
import styles from './styles.css'

@inject(EventAggregator, HttpClient, Router)
export class UserDetails {
  @bindable userId
  @bindable adminId
  @bindable isLocked

  constructor(emitter, http, router) {
    this.disposables = new Set()
    this.state = {}
    this.data = {}
    this.router = router
    this.http = http
    this.emitter = emitter
    this.styles = styles
    this.isRemovable = false
    this.isEditable = false
    this.isDisabled = true
    this.isLocked = true
  }

  attached() {
    this.emitter.publish('loading-channel', true)
    this.reset()
    this.listen()
    this.load()
  }

  listen() {
    const updateHandler = c => msg => this.update(c, msg)
    const submitHandler = c => msg => this.submit(c, msg)
    const deleteHandler = c => msg => this.delete(c, msg)

    this.disposables.add(
      this.emitter.subscribe("update-'user'-channel", updateHandler(this))
    )
    this.disposables.add(
      this.emitter.subscribe('submit-channel', submitHandler(this))
    )
    this.disposables.add(
      this.emitter.subscribe("delete-'user'-channel", deleteHandler(this))
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
      c.emitter.publish('loading-channel', false)
    }

    loadTask(this.http)(this.userId)(this.adminId).fork(
      onError(this),
      onSuccess(this)
    )
  }

  update(c, { isDisabled, _ }) {
    c.isDisabled = isDisabled
  }

  delete(c, { isRemovable, deletable }) {
    c.isRemovable = isRemovable
    console.log(`${deletable} is now rmeovable`, c.isRemovable)
  }

  lockForm(c, isLocked) {
    c.isLocked = isLocked
  }

  submit() {
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

    validateTask(this.state.user)(this.data.user)(this.isRemovable) //.bimap(tap(onError(c)), tap(onSuccess(c)))
      .chain(toDestinationTask(this.http)(this.adminId)(this.userId))
      .fork(onError(this), onSuccess(this))
  }

  detached() {
    this.disposables.forEach(x => x.dispose())
  }

  reset() {
    this.state = {}
    this.data = {}
    this.isRemovable = false
    this.isEditable = false
    this.isDisabled = true
    this.isLocked = true
  }
}
