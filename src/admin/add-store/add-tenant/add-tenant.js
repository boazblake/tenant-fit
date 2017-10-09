import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { loadTask, addTenantTask } from './model'
import { validateTenantTask } from './validations'
import { CheckAuth } from 'authConfig'
import styles from './styles.css'
import { log } from 'utilities'


@customElement('add-tenant')
@useView('./add-tenant.html')
@inject(HttpClient, DialogService, EventAggregator)
export class addTenant {
  constructor( http, modal, emitter ) {
    this.disposables = new Set()
    this.tenantId = ''
    this.data ={
      tenants:[]
    }
    this.state = {
      tenant: {}
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
    this.clientId = CheckAuth.clientId()
    this.adminId = CheckAuth.adminId()
    this.clientName = CheckAuth.clientName()
    this.load()
  }

  load(){
    const onSuccess = tenants => {
      this.data.tenants = tenants
    }

    const onError = error => {
      console.error(error)
      this.emitter.publish('notify-error', error.response)
    }

    loadTask(this.http)(this.clientId).fork(onError, onSuccess)
  }


  selectTenant() {
    this.validateTenant()
  }

  clearTenant() {
    sessionStorage.removeItem('tenantId')
    sessionStorage.removeItem('tenantName')
    this.state.tenant = null
    this.isDisabled = false
    log('this.state.tenant cleared')(this.state.tenant)
  }

  validateTenant() {
    const onSuccess = validatedTenant => {
      this.validatedTenant = validatedTenant

      validatedTenant.id
        ? this.storeTenant(validatedTenant)
        : this.registerTenant(validatedTenant)
    }

    const onError = error => {
      console.error(error)
      this.emitter.publish('notify-error', error)
    }

    validateTenantTask(this.state.tenant).fork(onError, onSuccess)
  }

  registerTenant(tenant) {
    const onError = error =>{
      console.error(error)
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = tenant => {
      log('success')(tenant)
      this.emitter.publish('notify-success', `${tenant.name} was sucessfully added to the database`)
      this.isDisabled = true
      this.storeTenant(tenant)
    }

    console.log(tenant)
    addTenantTask(this.http)(this.adminId)(this.clientId)(tenant).fork(onError, onSuccess)
  }

  storeTenant(tenant) {
    sessionStorage.setItem('tenantName', JSON.stringify(tenant.name))
    sessionStorage.setItem('tenantId', JSON.stringify(tenant.id))
    // this.emitter.publish('show-channel', {tenant:false})
    this.emitter.publish('show-channel', {storeUnit:true})
  }

  DropDownChanged(tenant) {
    console.log('dd changed',tenant)
    tenant.name === undefined || tenant.name === ""
      ? this.clearTenant()
      : this.isDisabled = true
  }

  toUser() {
    this.emitter.publish('show-channel', {user: true, tenant: false})
  }
 }
