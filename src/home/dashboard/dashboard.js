import { customElement, useView, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getTenantsTask } from './model'
import { style } from './style.css'
import { map, clone } from 'ramda'
import { log } from 'utilities'

@customElement('dashboard')
@useView('./dashboard.html')
@inject(EventAggregator, HttpClient, DialogService)
export class Dashboard {
  constructor( emitter, http, modal ) {
    this.disposables = new Set()
    this.state={}
    this.data={}
    this.emitter = emitter
    this.http = http
    this.modal = modal
    this.errors=[]
    this.style=style
  }

  activate(params){
    this.userId = params.id
  }

  attached() {
    this.reset()
    this.getTenants()
  }

  getTenants() {
    const onError = error =>{
      console.error(error)
      this.emitter.publish('notify-error', error.response)
    }
    
    const onSuccess = data => {
      this.data.tenants = data
      this.state.tenants = clone(this.data.tenants)
      // map(this.tenants.push(data))
      // this.emitter.publish('loading-channel', false)
    }

    // this.emitter.publish('loading-channel', true)
    getTenantsTask(this.http)(this.userId).fork(onError, onSuccess)
  }

  showStore(id) {
    this.getStore(id)
  }

  openModal(id) {
    this.modal.open( {viewModel: Store, model: id })
  }


  reset() {
  }

}