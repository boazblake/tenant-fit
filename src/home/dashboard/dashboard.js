import { customElement, useView, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getTenantsTask } from './model'
import { style } from './style.css'
import { map } from 'ramda'

@customElement('dashboard')
@useView('./dashboard.html')
@inject(EventAggregator, HttpClient, DialogService)
export class Dashboard {
  constructor( emitter, http, modal ) {
    this.disposables = new Set()
    this.tenants = []
    this.data={
      userId : null,
    }
    this.state={}
    this.emitter = emitter
    this.http = http
    this.modal = modal
    this.errors=[]
    this.style=style
  }

  activate(params){
    this.state.userId = params.id
  }

  attached() {
    this.reset()
    this.getTenants()
  }

  getTenants() {
    const onError = error =>
      console.error(error);

    const onSuccess = data => {
      map(this.tenants.push(data))
      this.emitter.publish('loading-channel', false)
    }

    getTenantsTask(this.http)(this.state.userId).fork(onError, onSuccess)
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