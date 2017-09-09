import { customElement, useView, inject } from 'aurelia-framework'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getStoresTask } from './model'
import { Prompt } from '../components/modal'


@customElement('stores')
@useView('./stores.html')
@inject(HttpClient, DialogService)
export class Stores {
  constructor( http, modal ) {
    this.disposables = new Set()
    this.stores = []
    this.userId = null
    this.state = {}
    this.http = http
    this.style = 'style'
    this.modal = modal
  }

  activate(params){
    this.userId = params.id
  }

  attached(params) {
    const onError = error =>
      console.error(error);

    const onSuccess = data => {
      console.log('success', data)
      this.stores = data
    }

    getStoresTask(this.http)(this.userId).fork(onError, onSuccess)
  }



}
