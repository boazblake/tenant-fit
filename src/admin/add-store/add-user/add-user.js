import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getUsersTask, validateUserTask, userModel, registerTask } from './model'
import { CheckAuth } from 'authConfig'
import styles from './styles.css'
import { log } from 'utilities'


@customElement('add-user')
@useView('./add-user.html')
@inject(HttpClient, DialogService, EventAggregator)
export class AddStore {
  @bindable storeModel
  constructor( http, modal, emitter ) {
    this.disposables = new Set()
    this.adminId = null
    this.data ={
      users:[]
    }
    this.state = {}
    this.http = http
    this.styles = styles
    this.modal = modal
    this.errors = []
    this.emitter = emitter
    this.isDisabled = false
  }

  attached(){
    this.adminId = CheckAuth.adminId()
    this.emitter.publish('loading-channel', false)
    this.getUsers()
  }

  getUsers(){
    const onSuccess = users => {
      this.data.users = users
    }

    const onError = error => {
      console.error(error)
      this.emitter.publish('notify-error', error.response)
    }

    getUsersTask(this.http)(this.adminId).fork(onError, onSuccess)
  }


  selectUser() {
    this.validateUser()
  }

  clearUser() {
    sessionStorage.setItem('clientId', '')
  }

  validateUser() {
    const onSuccess = validatedUser => {
      this.validatedUser = validatedUser
      log('user')(validatedUser)

      validatedUser.id
        ? this.storeUser(validatedUser)
        : this.registerUser(validatedUser)
    }

    const onError = error => {
      console.error(error)
      this.emitter.publish('notify-error', error)
    }

    validateUserTask(this.state.user).fork(onError, onSuccess)
  }

  registerUser(_user) {
    const onError = error =>{
      console.error(error)
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = user => {
      log('success')(user)
      this.emitter.publish('notify-success', `${user.name} was sucessfully added to the database`)
      this.isDisabled = true
      this.storeUser(user)
    }

    console.log(_user)
    registerTask(this.http)(this.adminId)(_user).fork(onError, onSuccess)
  }

  storeUser(user) {
    sessionStorage.setItem('clientName', JSON.stringify(user.name))
    sessionStorage.setItem('clientId', JSON.stringify(user.id))
    // this.emitter.publish('show-channel', {user: false})
    this.emitter.publish('show-channel', {tenant: true})
  }

  DropDownChanged(user) {
    if (user === null) {
      this.clearUser()
    }
  }
 }