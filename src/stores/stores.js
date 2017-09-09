import { customElement, useView, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getStoresTask } from './model'
import { getStoreTask } from './store/model'
import { Store } from './store/store.js'
import { style } from './style.css'

@customElement('stores')
@useView('./stores.html')
@inject(EventAggregator, HttpClient, DialogService)
export class Stores {
  constructor( emitter, http, modal ) {
    this.disposables = new Set()
    this.stores = []
    this.userId = null
    this.state = {}
    this.emitter = emitter
    this.http = http
    this.style = 'style'
    this.modal = modal
    this.errors=[]
    this.style=style
  }

  activate(params){
    this.userId = params.id
  }

  attached(params) {
    const onError = error =>
      console.error(error);

    const onSuccess = data => {
      console.log('success', data)
      this.emitter.publish('loading-channel', false)
      this.stores = data
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
    }

    getStoreTask(this.http)(id).fork(onError, onSuccess)
  }

  openModal(id) {
    this.modal.open( {viewModel: Store, model: id })
 }

}
