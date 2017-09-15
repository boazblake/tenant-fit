import { customElement, useView, inject } from 'aurelia-framework'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import style from './styles.css'


@customElement('tenants')
@useView('./tenants.html')
@inject(HttpClient, DialogService)
export class Tenants {
  constructor( http, modal ) {
    this.disposables = new Set()
    this.tenants = []
    this.stores = []
    this.userId = null
    this.state = {}
    this.http = http
    this.style = style
    this.modal = modal
    this.tenant = {name:'', userId:this.userId}
    this.store = {name:'', tenantId:'59b1f19cc64207001110f20f', userId:this.userId}
    this.errors = []
  }



 }