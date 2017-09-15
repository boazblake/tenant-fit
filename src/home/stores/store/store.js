import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getStoreTask } from './model.js'
import { style } from './style.css'

@customElement('store')
@useView('./store.html')
@inject(HttpClient, DialogController)
export class Store {
  @bindable store
  constructor( http, modal ) {
    this.disposables = new Set()
    this.modal = modal
    this.store = ''
    this.state = {}
    this.http = http
    this.style = style
  }

  bind() {
    return console.log('store??',this.store)
    this.reset()
    this.getStore(this.store._id)
  }

  getStore(id) {
    const onError = error => {
      console.error(error);
      this.emitter.publish('notify-error', error.response)
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