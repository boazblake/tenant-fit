import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getStoreTask } from './model'
import { style } from './style.css'

@customElement('store-popup')
@useView('./store-popup.html')
@inject(HttpClient, DialogController)
export class StorePopup {
  constructor( http, dController ) {
    this.disposables = new Set()
    this.dController = dController
    this.id = null
    this.state = {}
    this.http = http
    this.style = style
  }

  activate(id){
    this.id = id
    console.log('store id', id)
  }


  attached() {
    this.reset()
    this.getStore()
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

  reset() {

  }

}