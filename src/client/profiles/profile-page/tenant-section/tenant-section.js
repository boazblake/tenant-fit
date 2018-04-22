import { EventAggregator } from 'aurelia-event-aggregator'
import { bindable, inject } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { clone } from 'ramda'
import { loadTask } from './model'

@inject(EventAggregator, HttpClient)
export class TenantSection {
  @bindable userId
  @bindable adminId
  @bindable isLocked

  constructor(emitter, http) {
    this.disposables = new Set()
    this.emitter = emitter
    this.http = http
    this.state = {}
    this.data = {}
    this.isLocked = true
  }

  attached() {
    this.emitter.publish('loading-channel', true)
    this.reset()
    this.listen()
    this.load()
  }

  listen() {
    const reloadHandler = c => msg => {
      if (msg) {
        c.load()
      }
    }
    this.disposables.add(
      this.emitter.subscribe('reload-tenent-channel', reloadHandler(this))
    )
  }

  load() {
    const onSuccess = c => tenants => {
      c.data.tenants = tenants
      c.state.tenants = clone(c.data.tenants)
      c.emitter.publish('loading-channel', false)
    }

    const onError = c => error => {
      c.error = error
      console.error(error)
      this.emitter.publish('notify-error', error.response)
    }

    loadTask(this.http)(this.userId)(this.adminId).fork(
      onError(this),
      onSuccess(this)
    )
  }

  reset() {
    this.state = {}
    this.data = {}
    this.isLocked = true
  }
}
