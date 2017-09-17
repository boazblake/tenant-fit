import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { Router } from 'aurelia-router'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { toStoreDto, addStoreTask } from './model'
import { CheckAuth } from 'authConfig'
import styles from './styles.css'
import { log } from 'utilities'


@customElement('add-store-unit')
@useView('./add-store-unit.html')
@inject(HttpClient, DialogService, EventAggregator, Router)
export class addStoreUnit {
  constructor( http, modal, emitter, router ) {
    this.disposables = new Set()
    this.router = router
    this.data = {}
    this.state = {
      store: {}
    }
    this.http = http
    this.styles = styles
    this.modal = modal
    this.errors = []
    this.emitter = emitter
    this.isDisabled = false
  }


  attached(){
    this.emitter.publish('loading-channel', false)
    this.emitter.publish('show-channel', {storeUnit: true})
    this.adminId = CheckAuth.adminId()
    this.clientId = CheckAuth.clientId()
    this.clientName = CheckAuth.clientName()
    this.tenantId = CheckAuth.tenantId()
    this.tenantName = CheckAuth.tenantName()
  }

  clearStore() {
    this.state.store = null
  }

  createStoreDto() {
    const onSuccess = storeDto => {
      this.storeDto = storeDto
      this.registerStore(storeDto)
    }

    const onError = error => {
      console.error(error)
      this.emitter.publish('notify-error', error)
    }

    log('this.state.store')(this.state.store)
    toStoreDto(this.clientId)(this.tenantId)(this.adminId)(this.state.store).fork(onError, onSuccess)
  }

  registerStore(store) {
    const onError = error =>{
      console.error(error)
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = store => {
      log('success')(store)
      this.emitter.publish('notify-success', `${store.name} was sucessfully added to the database`)
      this.isDisabled = true
      this.cookiStore(store)
    }

    addStoreTask(this.http)(store).fork(onError, onSuccess)
  }

  cookiStore(store) {
    sessionStorage.removeItem('storeId')
    sessionStorage.removeItem('storeName')
    sessionStorage.removeItem('clientId')
    sessionStorage.removeItem('clientName')
    sessionStorage.removeItem('tenantId')
    sessionStorage.removeItem('tenantName')
    this.router.navigateToRoute('stores')
  }

  DropDownChanged(store) {
    console.log(store)
    store !== null
      ? this.isDisabled = true
      : this.isDisabled = false
  }
 }