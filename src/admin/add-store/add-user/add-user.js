import { bindable, inject, customElement, useView } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { loadTask, validateUserTask, registerTask } from './model'
import { CheckAuth } from 'authConfig'
import styles from './styles.css'


@customElement('add-user')
@useView('./add-user.html')
@inject(DialogService, EventAggregator, HttpClient)
export class AddStore {
  @bindable storeModel
  constructor( modal, emitter, http ) {
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
    this.load()
  }

  load(){
    const onSuccess = users => {
      this.data.users = users
    }

    const onError = error => {
      console.error(error)
      this.emitter.publish('notify-error', error.response)
    }

    loadTask(this.http)(this.adminId).fork(onError, onSuccess)
  }


  selectUser() {
    this.validateUser()
  }

  clearUser() {
    sessionStorage.setItem('clientId', '')
    this._user = {}
    this.isDisabled = false
  }

  validateUser() {
    const onSuccess = validatedUser => {
      this.validatedUser = validatedUser

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
      this.emitter.publish('notify-success', `${user.name} was sucessfully added to the database`)
      this.isDisabled = true
      this.storeUser(user)
    }

    registerTask(this.http)(this.adminId)(_user).fork(onError, onSuccess)
  }

  storeUser(user) {
    console.log('store user', user)
    sessionStorage.setItem('clientName', JSON.stringify(user.name))
    sessionStorage.setItem('clientId', JSON.stringify(user.id))
    // this.emitter.publish('show-channel', {user: false})
    this.emitter.publish('show-channel', {tenant: true})
  }

  DropDownChanged(user) {
    console.log('dd changed', user)
    user === null
      ? this.clearUser()
      : this.isDisabled = true
    }
 }
