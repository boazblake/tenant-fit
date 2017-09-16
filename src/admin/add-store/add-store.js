import { customElement, useView, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getUsersTask, validateUserTask, userModel, registerTask } from './model'
import { CheckAuth } from 'authConfig'
import styles from './styles.css'
import { log } from 'utilities'


@customElement('add-store')
@useView('./add-store.html')
@inject(HttpClient, DialogService, EventAggregator)
export class AddStore {
  constructor( http, modal, emitter ) {
    this.disposables = new Set()
    this.userId = null
    this.data ={}
    this.state = {}
    this.http = http
    this.styles = styles
    this.modal = modal
    this.emitter = emitter
    this.storeModel =
      { user:{}
      ,tenant:{}
      , store:{}
      }
  }

  attached(){
    this.userId = CheckAuth.userId()

    this.emitter.publish('loading-channel', false)
  }
}