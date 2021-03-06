import { inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { loadTask, addTenantTask } from './model'
import { validateTenantTask } from './validations'
import { CheckAuth } from 'authConfig'
import styles from './styles.css'
import { log } from 'utilities'


@inject(HttpClient, DialogService, EventAggregator)
export class addTenant {
  @bindable adminId

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

  bind() {
    this.clientId = JSON.parse(sessionStorage.clientId)
    this.clientName = JSON.parse(sessionStorage.clientName)
  }

  attached() {
    this.load()
    this.emitter.publish('loading-channel', false)
  }

  load(){
    const onError = c => error => {
      console.error(error)
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = c => tenants => {
      this.data.tenants = tenants
    }

    loadTask(this.http)(this.clientId).fork(onError(this), onSuccess(this))
  }


  next() {
    this.validateTenant()
  }

  clearTenant() {
    sessionStorage.removeItem('tenantId')
    sessionStorage.removeItem('tenantName')
    this.state.tenant = null
    this.isDisabled = false
  }

  validateTenant() {
    const onSuccess = c => validatedTenant => {
      this.validatedTenant = validatedTenant

      validatedTenant.id
        ? this.storeTenant(validatedTenant)
        : this.registerTenant(validatedTenant)
    }

    const onError = c => error => {
      console.error(error)
      this.emitter.publish('notify-error', error)
    }

    validateTenantTask(this.state.tenant).fork(onError(this), onSuccess(this))
  }

  registerTenant(tenant) {
    const onError = c => error =>{
      console.error(error)
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = c => tenant => {
      this.emitter.publish('notify-success', `${tenant.name} was sucessfully added to the database`)
      this.isDisabled = true
      this.storeTenant(tenant)
    }

    addTenantTask(this.http)(this.adminId)(this.clientId)(tenant).fork(onError(this), onSuccess(this))
  }

  storeTenant(tenant) {
    sessionStorage.setItem('tenantName', JSON.stringify(tenant.name))
    sessionStorage.setItem('tenantId', JSON.stringify(tenant.id))
    this.emitter.publish('show-channel', {brand:true})
  }

  DropDownChanged(tenant) {
    tenant.name === undefined || tenant.name === ""
      ? this.clearTenant()
      : this.isDisabled = true
  }

  back() {
    this.emitter.publish('show-channel', {user: true, tenant: false})
  }
 }
