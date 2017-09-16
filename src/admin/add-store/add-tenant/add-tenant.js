import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getTenantsTask, validateTenantsTask, tenantModel, addTenantTask } from './model'
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
    console.log(this.clientId, this.adminId)
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
        ? this.storeModel.tenant = validatedTenant
        : this.registerTenant(validatedTenant)
    }

    const onError = error => {
      console.error(error)
      this.emitter.publish('notify-error', error)
    }

    log('this.state.tenant')(this.state.tenant)
    validateTenantTask(this.state.tenant).fork(onError, onSuccess)
  }

  registerTenant(_tenant) {
    const onError = error =>{
      console.error(error)
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = tenant => {
      log('success')(tenant)
      this.storeModel.tenant = tenant
      this.emitter.publish('notify-success', `${tenant.name} was sucessfully added to the database`)
      this.isDisabled = true
    }

    console.log(_tenant)
    addTenantTask(this.http)(this.userId)(this.storeModel.user.id)(_tenant).fork(onError, onSuccess)
  }

  DropDownChanged(tenant) {
    console.log(tenant)
    tenant !== null
      ? this.isDisabled = true
      : this.isDisabled = false
  }
 }