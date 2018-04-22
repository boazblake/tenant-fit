import { EventAggregator } from 'aurelia-event-aggregator'
import { bindable, inject } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { clone } from 'ramda'
import { loadTask, filterTask } from './model'

@inject(EventAggregator, HttpClient)
export class StoreSection {
  @bindable userId
  @bindable adminId

  constructor(emitter, http) {
    this.disposables = new Set()
    this.emitter = emitter
    this.http = http
    this.state = {}
    this.data = {}
  }

  attached() {
    this.emitter.publish('loading-channel', true)
    this.listen()
    this.reset()
    this.load()
  }

  listen() {
    this.emitter.publish('loading-channel', true)

    const showStoreHandler = c => msg => {
      c.state.filterBy = msg
      c.filterStores()
    }

    this.disposables.add(
      this.emitter.subscribe('show-store-channel', showStoreHandler(this))
    )
  }

  load() {
    const onSuccess = c => stores => {
      c.data.stores = stores
      c.state.stores = clone(c.data.stores)
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

  filterStores() {
    const onSuccess = c => stores => {
      c.state.stores = stores
      c.emitter.publish('loading-channel', false)
    }

    const onError = _ => {}

    filterTask(this.state.filterBy)(this.data.stores).fork(
      onError,
      onSuccess(this)
    )
  }

  reset() {
    this.state = {}
    this.data = {}
  }
}
