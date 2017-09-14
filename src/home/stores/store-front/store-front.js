import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getStoreTask } from './model.js'
import { style } from './style.css'

@customElement('store-front')
@useView('./store-front.html')
@inject(HttpClient, DialogController)
export class StoreFront {
  @bindable storeFront
  constructor( http, dController ) {
    this.disposables = new Set()
    this.dController = dController
    this.store = ''
    this.id = null
    this.state = {}
    this.http = http
    this.style = style
  }

  bind() {
    return console.log('store??',this.storeFront)
    this.reset()
    this.getStore(this.storeFront._id)
  }

  getStore(id) {
    const onError = error => {
      console.error(error);
      this.errors.push({type:'store', msg: 'error with getting store'})
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
     console.log('store?',this.store)
   }

}