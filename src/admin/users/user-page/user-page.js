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
    const deleteHandler = c => msg => c.delete(c, msg)
    const lockHandler = c => msg => c.lock(c, msg)

    this.disposables.add(
      this.emitter.subscribe(`delete-'user'-channel`, deleteHandler(this))
    )

    this.disposables.add(
      this.emitter.subscribe('lock-channel', lockHandler(this))
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

  lock(c, isLocked) {
    c.isLocked = isLocked
  }

  delete(c, isRemovable) {
    c.isRemovable = isRemovable
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
