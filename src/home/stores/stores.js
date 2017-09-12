import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getStoresTask, toVm } from './model'
import { getStoreTask } from './store/model'
import { Store } from './store/store.js'
import { style } from './style.css'
import { map } from 'ramda'

@customElement('stores')
@useView('./stores.html')
@inject(EventAggregator, HttpClient, DialogService)
export class Stores {
  @bindable tenantIds
  constructor( emitter, http, modal ) {
    this.disposables = new Set()
    this.stores = []
    this.state = {}
    this.emitter = emitter
    this.http = http
    this.errors=[]
    this.style=style
  }

  attached() {
    this.reset()
    // this.getStores()
  }

  getStores() {
    const onError = error =>
      console.error(error);

    const onSuccess = data => {
      this.stores = data
      this.emitter.publish('loading-channel', false)
    }

    getStoresTask(this.http)(this.ids).fork(onError, onSuccess)
  }

  openModal(id) {
    this.modal.open( {viewModel: Store, model: id })
  }

  reset() {
    console.log('tenant ids in store ', this.tenantIds)
  }
}