import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getStoresTask, toVm } from './model'
import { getStoreTask } from './store-front/model'
import { style } from './style.css'
import { map, clone } from 'ramda'

@customElement('stores')
@useView('./stores.html')
@inject(EventAggregator, HttpClient, DialogService)
export class Stores {
  @bindable tenants
  @bindable userId
  constructor( emitter, http, modal ) {
    this.disposables = new Set()
    this.data = {}
    this.state = {}
    this.emitter = emitter
    this.http = http
    this.errors=[]
    this.style=style
  }

  attached() {
    this.reset()
    this.getStores()
  }

  getStores() {
    const onError = error =>
      console.error(error);

    const onSuccess = data => {
      this.data.stores = data
      console.log(this.data.stores)
      this.emitter.publish('loading-channel', false)
    }

    this.emitter.publish('loading-channel', true)
    getStoresTask(this.http)(this.userId).fork(onError, onSuccess)
  }

  // openModal(id) {
  //   this.this.modal.open( {viewModel: Store, model: id })
  // }

  reset() {
  }


}