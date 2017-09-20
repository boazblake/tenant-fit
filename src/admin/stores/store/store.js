import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getStoreTask } from './model.js'
import { styles } from './styles.css'
import { StorePopup } from '../store-popup/store-popup'
import { clone } from 'ramda'

@customElement('store')
@useView('./store.html')
@inject(HttpClient, DialogService, EventAggregator, StorePopup)
export class Store {
  @bindable s
  constructor( http, modal, emitter ) {
    this.disposables = new Set()
    this.data = {}
    this.state = {}
    this.http = http
    this.style = styles
    this.emitter = emitter
    this.errors = {}
    this.modal = modal
  }

  attached() {
    this.reset()
    this.getStore(this.s._id)
  }

  getStore(id) {
    const onError = error => {
      console.error(error);
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = store => {
      this.data.store = store
      this.state.store = clone(this.data.store)
      this.errors['store'] = ''
      this.emitter.publish('loading-channel', false)
    }

    this.emitter.publish('loading-channel', true)
    getStoreTask(this.http)(id).fork(onError, onSuccess)
  }

  showStore(id) {
    console.log(id)
    this.modal.open( {viewModel: StorePopup, model: id }).whenClosed(response => {
      if (!response.wasCancelled) {
        console.log('updated')
        this.data.store = response.output
        this.state.store = clone(this.data.store)
      } else {
        console.log('not updated')
      }
    })
  }


  reset() {
  }

}