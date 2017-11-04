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
    this.load()
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
