import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getTenantsTask, validateTenantTask, tenantModel, addTenantTask } from './model'
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
    this.getTenants()
  }

  getTenants(){
    const onSuccess = tenants => {
      this.data.tenants = tenants
      log('TENANTS')(this.data.tenants)
    }

    const onError = error => {
      console.error(error)
      this.emitter.publish('notify-error', error.response)
    }

    console.log(this)
    getTenantsTask(this.http)(this.clientId).fork(onError, onSuccess)
  }


  selectTenant() {
    this.validateTenant()
  }

  clearTenant() {
    this.state.tenant.addTenant = null
  }

  validateTenant() {
    const onSuccess = validatedTenant => {
      this.validatedTenant = validatedTenant
      log('tenant')(validatedTenant)

      validatedTenant.id
        ? this.storeTenant(validatedTenant)
        : this.registerTenant(validatedTenant)
    }

    const onError = error => {
      console.error(error)
      this.emitter.publish('notify-error', error)
    }

    log('this.state.tenant')(this.state.tenant)
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
    this.emitter.publish('show-channel', {tenant:false})
    this.emitter.publish('show-channel', {storeUnit:true})
  }

  DropDownChanged(tenant) {
    console.log(tenant)
    tenant !== null
      ? this.isDisabled = true
      : this.isDisabled = false
  }
 }