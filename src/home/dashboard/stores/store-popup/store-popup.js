import { customElement, useView, inject } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getStoreTask } from './model'
import { style } from './style.css'

@customElement('store-popup')
@useView('./store-popup.html')
@inject(HttpClient, DialogController)
export class StorePopup {
  constructor(http, dController) {
    this.disposables = new Set()
    this.dController = dController
    this.id = null
    this.state = {}
    this.http = http
    this.style = style
  }

  activate(id) {
    this.id = id
  }

  attached() {
    const onError = error => console.error(error)

    const onSuccess = data => {
      this.store = data
    }

    getStoreTask(this.http)(this.id).fork(onError, onSuccess)
  }
}
