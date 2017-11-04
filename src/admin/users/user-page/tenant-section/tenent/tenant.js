import { EventAggregator } from 'aurelia-event-aggregator'
import { bindable, inject } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { clone } from 'ramda'
import { toDestinationTask, getChangeColor } from './model'
import { validateTask } from './validations'

@inject(EventAggregator, HttpClient)
export class Tenant {
  @bindable userId
  @bindable adminId
  @bindable tenant
  @bindable isLocked

  constructor(emitter, http) {
    this.disposables = new Set()
    this.emitter = emitter
    this.http = http
    this.state = {}
    this.data = {}
    this.isEditable = false
    this.isLocked = true
    this.isDisabled = true
    this.isRemovable = false
  }

  attached() {
    this.listen()
    this.state.tenant = clone(this.tenant)
  }

  listen() {
    const updateHandler = c => msg => c.update(c, msg)
    const submitHandler = c => msg => c.submit(c, msg)
    const editHandler = c => msg => c.edit(c, msg)
    const deleteHandler = c => msg => c.delete(c, msg)

    this.disposables.add(
      this.emitter.subscribe(`update-'tenant'-channel`, updateHandler(this))
    )
    this.disposables.add(
      this.emitter.subscribe('submit-channel', submitHandler(this))
    )
    this.disposables.add(
      this.emitter.subscribe('edit-channel', editHandler(this))
    )
    this.disposables.add(
      this.emitter.subscribe(`delete-'tenant'-channel`, deleteHandler(this))
    )
  }

  edit(c, { _, isEditable }) {
    c.isEditable = isEditable
  }

  delete(c, { isRemovable, deletable }) {
    if (deletable._id === c.tenant._id) {
      c.isRemovable = isRemovable
    }
    c.deleteColor = getChangeColor(c.isRemovable)
  }

  submit(c, _) {
    const onError = c => error => {
      if (error.msg) return c.emitter.publish('notify-error', error.msg)
      c.emitter.publish('notify-error', error.response)
    }

    const onSuccess = c => tenant => {
      if (tenant.msg) {
        c.emitter.publish('notify-warning', tenant.msg)
      }
      c.tenant = tenant
      c.emitter.publish(
        'notify-success',
        `${tenant.name} was successfuly updated`
      )
    }

    validateTask(c.tenant)(c.state.tenant)(c.isRemovable)
      .chain(toDestinationTask(c.http)(c.adminId)(c.tenant._id))
      .fork(onError(this), onSuccess(this))
  }

  update(c, { isDisabled, editable }) {
    if (editable._id === c.tenant._id) {
      c.isDisabled = isDisabled
      console.log('update tenant.isdisabled', c.isDisabled)
    }
  }

  showStores(id) {
    if (this.isLocked) {
      this.emitter.publish('show-store-channel', id)
    }
  }

  reset() {
    this.state = {}
    this.data = {}
    this.isEditable = false
    this.isLocked = true
    this.isDisabled = true
    this.isRemovable = false
  }
}
