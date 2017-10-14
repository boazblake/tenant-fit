import { inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { loadTask, addBrandTask, fetchLogoTask } from './model'
import { validateBrandTask } from './validations'
import { CheckAuth } from 'authConfig'
import styles from './styles.css'
import { log } from 'utilities'


@inject(HttpClient, DialogService, EventAggregator)
export class addBrand {
  @bindable adminId

  constructor( http, modal, emitter ) {
    this.disposables = new Set()
    this.brandId = ''
    this.data ={
      brands:[],
      newBrands:[]
    }
    this.state = {
      brand: {}
    }
    this.http = http
    this.styles = styles
    this.modal = modal
    this.errors = []
    this.emitter = emitter
    this.isDisabled = false
  }

  attached(){
    this.load()
    this.emitter.publish('loading-channel', false)
  }

  load(){
    const onSuccess = c => brands => {
      c.data.brands = brands
    }

    const onError = c => error => {
      console.error(error)
      c.emitter.publish('notify-error', error.response)
    }

    loadTask(this.http)(this.adminId).fork(onError(this), onSuccess(this))
  }


  next() {
    this.validateBrand()
  }

  clearBrand() {
    sessionStorage.removeItem('brandId')
    sessionStorage.removeItem('brandName')
    this.state.brand = null
    this.isDisabled = false
    log('this.state.brand cleared')(this.state.brand)
  }

  validateBrand() {
    const onSuccess = c => validatedBrand => {
      c.validatedBrand = validatedBrand

      validatedBrand.id
        ? c.storeBrand(validatedBrand)
        : c.registerBrand(validatedBrand)
    }

    const onError = c => error => {
      console.error(error)
      c.emitter.publish('notify-error', error)
    }

    validateBrandTask(this.state.brand).fork(onError(this), onSuccess(this))
  }

  registerBrand(b) {
    const onError = c => error =>{
      console.error(error)
      c.emitter.publish('notify-error', error.response)
    }

    const onSuccess = c=> brand => {
      log('success')(brand)
      c.emitter.publish('notify-success', `${brand.name} was sucessfully added to the database`)
      c.isDisabled = true
      c.storeBrand(brand)
    }

    console.log('brand',b)
    addBrandTask(this.http)(this.adminId)(b).fork(onError(this), onSuccess(this))
  }

  storeBrand(brand) {
    sessionStorage.setItem('brandId', JSON.stringify(brand.id))
    // this.emitter.publish('show-channel', {brand:false})
    this.emitter.publish('show-channel', {storeUnit:true})
  }

  DropDownChanged(brand) {
    console.log('dd changed',brand)
    !brand || brand.name === undefined || brand.name === ""
      ? this.clearBrand()
      : this.isDisabled = true
  }

  searchClearBit() {
    const onError = c => error => {
      console.error(error)
      c.emitter.publish('notify-error', error.response)
    }

    const onSuccess = c => data =>
      c.data.newBrands = data


    fetchLogoTask(this.http)(this.query).fork(onError(this), onSuccess(this))
  }

  updateBrand(b) {
    this.state.brand = b
    this.validateBrand()
  }

  back() {
    this.emitter.publish('show-channel', {user: true, brand: false})
  }
 }
