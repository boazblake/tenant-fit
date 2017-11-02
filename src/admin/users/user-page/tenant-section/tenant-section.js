import { DialogService } from 'aurelia-dialog'
import { EventAggregator } from 'aurelia-event-aggregator'
import { bindable, inject } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { clone } from 'ramda'
import { loadTask } from './model'

@inject(DialogService, EventAggregator, HttpClient)
export class TenantSection {
  @bindable userId
  @bindable adminId

  constructor(ds, emitter, http) {
    this.disposables = new Set()
    this.ds = ds
    this.emitter = emitter
    this.http = http
    this.state = {}
    this.data = {}
  }

  attached() {
    this.emitter.publish('loading-channel', true)
    this.reset()
    this.listen()
    this.load()
  }

  listen() {
    const editTenantHandler = c => msg => this.edit(c, msg)
    const submitTenantHandler = c => msg => this.submit(c, msg)
    const deleteHandler = c => msg => this.delete(c, msg)

    this.disposables.add(
      this.emitter.subscribe('edit-channel', editTenantHandler(this))
    )
    this.disposables.add(
      this.emitter.subscribe('submit-channel', submitTenantHandler(this))
    )
    this.disposables.add(
      this.emitter.subscribe('delete-channel', deleteHandler(this))
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

  edit(c, { _, isEditable }) {
    c.isEditable = isEditable
  }

  delete(c, msg) {
    console.log(msg)
  }

  submit(c, msg) {
    console.log(msg)
  }

  showStores(id) {
    this.emitter.publish('show-store-channel', id)
  }

  reset() {
    // setTimeout(() => {
    //   console.log('reset', this.tenantText.innerHTML)
    // })
    this.state = {}
    this.data = {}
    this.isEditable = false
  }
}
