import { inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { Router } from 'aurelia-router'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { loadTask, toStoreDto, toSaveStoreTask, } from './model'
import { validateStoreTask } from './validations'
import { CheckAuth } from 'authConfig'
import styles from './styles.css'
import { log } from 'utilities'
import { clone } from 'ramda'


@inject(HttpClient, DialogService, EventAggregator, Router)
export class addStoreUnit {
  @bindable adminId

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

  bind() {
    this.brandId = JSON.parse(sessionStorage.brandId)
    console.log(this.brandId);
  }

  attached(){
    this.load()
    this.emitter.publish('loading-channel', false)
    this.emitter.publish('show-channel', {storeUnit: true})
  }

  load() {
    const onError = c => error => {
      console.error(error)
      this.emitter.publish('notify-error', error)
    }

    const onSuccess = c => data =>
      c.state.store.brand = data

    loadTask(this.http)(this.adminId)(this.brandId).fork(onError(this), onSuccess(this))
  }

  clearStore() {
    this.state.store = null
  }

  saveStore() {
    const onError = c => error => {
      console.error(error)
      this.emitter.publish('notify-error', error)
    }

    const onSuccess = c => validStore => {
      this.state.validatedStore = validStore
      this.createStoreDto(clone(this.state.validatedStore))
    }

    validateStoreTask(this.state.store).fork(onError(this), onSuccess(this))
  }

  createStoreDto(store) {
    const onSuccess = c => storeDto => {
      this.storeDto = storeDto
      this.registerStore(storeDto)
    }

    const onError = c => error => {
      console.error(error)
      this.emitter.publish('notify-error', error)
    }

    log('updates to store')(store)
    toStoreDto(this.clientId)(this.tenantId)(this.brandId)(this.adminId)(store).fork(onError(this), onSuccess(this))
  }

  registerStore(store) {
    const onError = c => error =>{
      console.error(error)
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = c => store => {
      log('success')(store)
      this.emitter.publish('notify-success', `${store.name} was sucessfully added to the database`)
      this.isDisabled = true
      this.clearStoreSession(store)
    }

    toSaveStoreTask(this.http)(store).fork(onError(this), onSuccess(this))
  }

  clearStoreSession(store) {
    sessionStorage.removeItem('storeId')
    sessionStorage.removeItem('storeName')
    sessionStorage.removeItem('clientId')
    sessionStorage.removeItem('clientName')
    sessionStorage.removeItem('tenantId')
    sessionStorage.removeItem('tenantName')
    sessionStorage.removeItem('brandId')
    this.router.navigateToRoute('stores')
  }

  DropDownChanged(store) {
    console.log(store)
    store !== null
      ? this.isDisabled = true
      : this.isDisabled = false
  }

  back() {
    this.emitter.publish('show-channel', {brand: true, storeUnit:false})
  }
 }
