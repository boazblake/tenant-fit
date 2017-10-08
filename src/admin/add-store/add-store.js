import { customElement, inject, useView } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { CheckAuth } from 'authConfig'
import styles from './styles.css'
import { log } from 'utilities'


@customElement('add-store')
@useView('./add-store.html')
@inject(HttpClient, DialogService, EventAggregator)
export class AddStore {
  constructor( http, modal, emitter ) {
    this.disposables = new Set()
    this.adminId = null
    this.data ={}
    this.state = {}
    this.http = http
    this.isDisabled = false
    this.styles = styles
    this.modal = modal
    this.emitter = emitter
    this.show = {
      user: true,
      tenant: false,
      storeUnit: false
    }
  }

  attached(){
    this.adminId = CheckAuth.userId()
    this.emitter.publish('loading-channel', false)
    this.load()
  }

  load() {
    const handler = msg => {
      console.log(msg)
      this.show = msg
    }

    this.emitter.subscribe('show-channel', handler)
  }


}
