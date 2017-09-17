import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getStoresTask } from './model'
import { getStoreTask } from './store/model'
import { StorePopup } from './store-popup/store-popup'
import { style } from './style.css'
import { CheckAuth } from 'authConfig'

@customElement('stores')
@useView('./stores.html')
@inject(EventAggregator, HttpClient, DialogService)
export class Stores {
  constructor( emitter, http, modal ) {
    this.disposables = new Set()
    this.stores = []
    this.state = {}
    this.emitter = emitter
    this.http = http
    this.style = 'style'
    this.modal = modal
    this.errors=[]
    this.style=style
  }


  attached(params) {
    this.userId = CheckAuth.userId()

    const onError = error =>
      console.error(error);

    const onSuccess = data => {
      this.stores = data
      this.emitter.publish('loading-channel', false)
    }

    getStoresTask(this.http)(this.userId).fork(onError, onSuccess)
  }

  showStore(id) {
    this.getStore(id)
  }


  getStore(id) {
    const onError = error => {
      console.error(error);
      this.errors.push({type:'stores', msg: 'error with getting stores'})
    }

    const onSuccess = store => {
      this.store = store
      this.errors['store'] = ''
      this.openModal(id)
      this.emitter.publish('loading-channel', false)
    }

    this.emitter.publish('loading-channel', true)
    getStoreTask(this.http)(id).fork(onError, onSuccess)
  }

}