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
    this.userId = null
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
    this.userId = CheckAuth.userId()
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

    getUsersTask(this.http)(this.userId).fork(onError, onSuccess)
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
        ? this.storeUser(validatedUser.id)
        : this.registerUser(validatedUser)
    }

    const onError = error => {
      console.error(error)
      this.emitter.publish('notify-error', error)
    }

    log('this.state.user')(this.state.user)
    validateUserTask(this.state.user).fork(onError, onSuccess)
  }

  registerUser(_user) {
    const onError = error =>{
      console.error(error)
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = user => {
      log('success')(user)
      sessionStorage.setItem('clientId', JSON.stringify(user.id))
      this.emitter.publish('show-channel', {user: false})
      this.emitter.publish('notify-success', `${user.name} was sucessfully added to the database`)
      this.isDisabled = true
    }

    console.log(_user)
    registerTask(this.http)(this.userId)(_user).fork(onError, onSuccess)
  }

  storeUser(id) {
    sessionStorage.setItem('clientId', JSON.stringify(id))
    console.log('here')
    this.emitter.publish('show-channel', {user: false})
    this.emitter.publish('show-channel', {tenant: true})
  }

  DropDownChanged(user) {
    console.log('dropdownchanged user', user)
    if (user === null) {
      this.clearUser()
    }
  }
 }