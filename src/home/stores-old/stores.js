import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getStoresTask, toVm } from './model'
import { getStoreTask } from './store/model'
import { style } from './style.css'
import { map, clone } from 'ramda'

@customElement('stores-old')
@useView('./stores-old.html')
@inject(EventAggregator, HttpClient, DialogService)
export class StoresOld {
  @bindable tenants
  @bindable userId
  constructor( emitter, http, modal ) {
    this.disposables = new Set()
    this.stores = [{}, {}]
    this.data = {}
    this.state = {}
    this.emitter = emitter
    this.http = http
    this.errors=[]
    this.style=style
    this.modal = modal
  }

  created() {
    this.reset()
  }

  attached() {
    this.getStores()
  }

  getStores() {
    const onError = error =>{
      console.error(error)
      this.emitter.publish('notify-error', error.response)
    }
    const onSuccess = data => {
      this.stores = clone(data)
      this.emitter.publish('loading-channel', false)
    }

    this.emitter.publish('loading-channel', true)
    getStoresTask(this.http)(this.userId).fork(onError, onSuccess)
  }

  reset() {
  }


}