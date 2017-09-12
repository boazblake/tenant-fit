import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getStoreTask } from './model.js'
import { style } from './style.css'

@customElement('store')
@useView('./store.html')
@inject(HttpClient, DialogController)
export class Store {
  @bindable storeId
  constructor( http, dController ) {
    this.disposables = new Set()
    this.dController = dController
    this.id = null
    this.state = {}
    this.http = http
    this.style = style
  }

  attached() {
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


   colorChange() {
    //  console.log(typeof this.storeColors);
      // TODO: grab  b/ style and create a fucntion that chnages the color based on another input
      changeStoreColors(this.storeColors)
   }

}