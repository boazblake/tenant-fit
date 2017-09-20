import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogController } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getStoreTask, updateStoreTask } from './model'
import styles from './styles.css'
import { CheckAuth } from 'authConfig'

@customElement('store-popup')
@useView('./store-popup.html')
@inject(HttpClient, DialogController, EventAggregator)
export class StorePopup {
  constructor( http, dController, emitter) {
    this.disposables = new Set()
    this.dController = dController
    this.state = {}
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


  attached(params) {
    const onError = error =>{
      console.error(error);
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = store => {
      this.state.store = store
      console.log(this.state.store)
    }

    getStoreTask(this.http)(this.storeId).fork(onError, onSuccess)
  }

  editForm() {
    this.isDisabled = !this.isDisabled
    this.isEditable = !this.isEditable
  }

  updateStore(storeId) {
    const onError = error =>{
      console.error(error);
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = store => {
      this.state.store = store
      this.emitter.publish('notify-success', store.name)
      this.dController.ok(store.name)
    }

    updateStoreTask(this.http)(this.adminId)(storeId)(this.state.store).fork(onError, onSuccess)
  }



}