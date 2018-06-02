import { inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { CheckAuth } from 'authConfig'
import styles from './styles.css'
import { log } from 'utilities'

@inject(HttpClient, DialogService, EventAggregator)
export class AddStore {
  constructor(http, modal, emitter) {
    this.disposables = new Set()
    this.adminId = null
    this.data = {}
    this.state = {}
    this.http = http
    this.isDisabled = false
    this.styles = styles
    this.modal = modal
    this.emitter = emitter
    this.show = {
      user: true,
      tenant: false,
      brand: false,
      storeUnit: false
    }
    this.form = {}
  }

  bind() {
    this.adminId = CheckAuth.userId()
  }

  attached() {
    this.load()
    this.emitter.publish('loading-channel', false)
  }

  load() {
    const handler = c => msg => (c.show = msg)

    this.emitter.subscribe('show-channel', handler(this))
  }
}
