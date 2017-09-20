import { customElement, useView, inject, bindable, observable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogController } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getStoreTask, updateStoreTask, dirtyState } from './model'
import styles from './styles.css'
import { CheckAuth } from 'authConfig'
import { clone, equals } from 'ramda'

@customElement('store-popup')
@useView('./store-popup.html')
@inject(HttpClient, DialogController, EventAggregator)
export class StorePopup {
  @observable state
  constructor( http, dController, emitter) {
    this.disposables = new Set()
    this.dController = dController
    this.state = {}
    this.data = {}
    this.http = http
    this.emitter = emitter
    this.isEditable = false
    this.isDisabled = true
    this.styles = styles
  }

  activate(storeId){
    this.storeId = storeId
    this.adminId = CheckAuth.adminId()
  }

  stateChanged(newValue, oldValue){
    console.log(newValue, oldValue)
  }


  attached() {
    const onError = error =>{
      console.error(error);
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = store => {
      this.data.store = store
      this.state.store = clone(this.data.store)
    }

    getStoreTask(this.http)(this.storeId).fork(onError, onSuccess)
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
    const onError = error =>{
      console.error(error);
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = store => {
      this.data.store = store
      this.state.store = clone(this.data.store)
      this.emitter.publish('notify-success', `${store.name} was successfuly updated`)
      this.dController.ok(this.state.store)
    }

    updateStoreTask(this.http)(this.adminId)(storeId)(this.state.store).fork(onError, onSuccess)
  }



}