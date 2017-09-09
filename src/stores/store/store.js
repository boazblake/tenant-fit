import { customElement, useView, inject } from 'aurelia-framework'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getStoreTask } from './model'


@customElement('store')
@useView('./store.html')
@inject(HttpClient, DialogService)
export class Store {
  constructor( http, modal ) {
    this.disposables = new Set()
    this.storeId = null
    this.userId = null
    this.state = {}
    this.http = http
    this.style = 'style'
    this.modal = modal
  }

  activate(params, routeConfig, navigationInstruction){
    console.log(params, routeConfig, navigationInstruction);
    this.storeId = params.id
  }


  attached(params) {
    const onError = error =>
      console.error(error);

    const onSuccess = data => {
      console.log('success', data)
      this.store = data
    }

    getStoreTask(this.http)(this.storeId).fork(onError, onSuccess)
  }



}
