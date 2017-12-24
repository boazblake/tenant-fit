import { Router } from 'aurelia-router'
import { EventAggregator } from 'aurelia-event-aggregator'
import { inject } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { clone, equals } from 'ramda'
import { getBrandTask, loadTask, updateStoreTask } from './model'
import styles from './styles.css'
import { CheckAuth } from 'authConfig'

@inject(HttpClient, Router, EventAggregator)
export class StorePage {
  constructor(http, router, emitter) {
    this.disposables = new Set()
    this.router = router
    this.state = {}
    this.data = {}
    this.http = http
    this.emitter = emitter
    this.isRemovable = false
    this.isLocked = true
    this.isDisabled = true
    this.styles = styles
  }

  activate(storeId) {
    this.reset()
    this.storeId = storeId.id
    this.adminId = CheckAuth.adminId()
  }

  attached() {
    this.load()
  }

  load() {
    const onError = error => {
      console.error(error)
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = store => {
      this.data.store = store
      this.state.store = clone(this.data.store)
    }

    loadTask(this.http)(this.storeId)
      .chain(getBrandTask(this.http))
      .fork(onError, onSuccess)
  }

  editForm() {
    this.isDisabled = !this.isDisabled
    this.isEditable = !this.isEditable
  }

  validateStore() {
    equals(this.state.store, this.data.store)
      ? this.emitter.publish('notify-info', 'nothing to update')
      : this.updateStore(this.state.store._id)
  }

  updateStore(storeId) {
    const onError = c => error => {
      console.error(error)
      c.emitter.publish('notify-error', error.response)
    }

    const onSuccess = c => store => {
      c.data.store = store
      c.state.store = clone(c.data.store)
      c.emitter.publish(
        'notify-success',
        `${store.name} was successfuly updated`
      )
    }

    updateStoreTask(this.http)(this.adminId)(storeId)(this.state.store).fork(
      onError(this),
      onSuccess(this)
    )
  }

  goBack() {
    this.router.navigateBack()
  }

  reset() {
    this.state = {}
    this.data = {}
    this.isRemovable = false
    this.isLocked = true
  }
}
