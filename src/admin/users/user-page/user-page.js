import { EventAggregator } from 'aurelia-event-aggregator'
import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'
import { HttpClient } from 'aurelia-http-client'
import { loadTask } from './model'
import styles from './styles.css'
import { CheckAuth } from 'authConfig'

@inject(HttpClient, EventAggregator, Router)
export class UserPage {
  constructor(http, emitter, router) {
    this.disposables = new Set()
    this.state = {}
    this.data = {}
    this.http = http
    this.emitter = emitter
    this.styles = styles
    this.router = router
    this.isRemovable = false
    this.isLocked = true
  }

  activate(userId) {
    this.reset()
    this.userId = userId.id
    this.adminId = CheckAuth.adminId()
  }

  attached() {
    this.load()
    this.listen()
  }

  listen() {
    const deleteFormHandler = c => msg => (c.isRemovable = msg)
    const lockFormHandler = c => msg => c.lockForm(c, msg)

    this.disposables.add(
      this.emitter.subscribe('delete-channel', deleteFormHandler(this))
    )

    this.disposables.add(
      this.emitter.subscribe('lock-channel', lockFormHandler(this))
    )
  }

  load() {
    const onError = c => error => {
      console.error(error)
      c.emitter.publish('notify-error', error.response)
    }

    const onSuccess = c => user => {
      c.user = user
      c.emitter.publish('loading-channel', false)
    }

    loadTask(this.http)(this.userId).fork(onError(this), onSuccess(this))
  }

  lockForm(c, isLocked) {
    c.isLocked = isLocked
  }

  submit() {
    this.emitter.publish("submit-'user'-channel", true)
  }

  detached() {
    this.disposables.forEach(x => x.dispose())
  }

  reset() {
    this.state = {}
    this.data = {}
    this.isRemovable = false
    this.isLocked = true
  }
}
