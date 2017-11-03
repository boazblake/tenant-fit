import { EventAggregator } from 'aurelia-event-aggregator'
import { bindable, inject } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { clone } from 'ramda'
import { loadTask, toDestinationTask, getChangeColor } from './model'

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
    const editTenantHandler = c => msg => this.edit(c, msg)
    const submitTenantHandler = c => msg => this.submit(c, msg)
    const deleteHandler = c => msg => this.delete(c, msg)
    const updateHandler = c => msg => this.update(c, msg)

    this.disposables.add(
      this.emitter.subscribe('edit-channel', editTenantHandler(this))
    )
    this.disposables.add(
      this.emitter.subscribe('submit-channel', submitTenantHandler(this))
    )
    this.disposables.add(
      this.emitter.subscribe("delete-'tenant'-channel", deleteHandler(this))
    )
    this.disposables.add(
      this.emitter.subscribe("update-'tenant'-channel", updateHandler(this))
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

  delete(c, { isRemovable, deletable }) {
    c.isRemovable = isRemovable
    console.log(`${deletable} is now rmeovable`, c.isRemovable)
  }

  submit(c, msg) {
    console.log(msg)
  }

  update(c, isDisabled) {
    c.isDisabled = isDisabled
    console.log('update tenant.isdisabled', c.isDisabled)
  }

  showStores(id) {
    if (this.isLocked) {
      this.emitter.publish('show-store-channel', id)
    }
  }

  reset() {
    // setTimeout(() => {
    //   console.log('reset', this.tenantText.innerHTML)
    // })
    this.state = {}
    this.data = {}
    this.isEditable = false
    this.isLocked = true
    this.isDisabled = true
  }
}
