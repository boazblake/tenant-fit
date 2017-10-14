import { bindable, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { loadTask, registerTask } from './model'
import { validateUserTask } from './validations'
import { CheckAuth } from 'authConfig'
import styles from './styles.css'


@inject(DialogService, EventAggregator, HttpClient)
export class addUser {
  @bindable adminId

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
    this.emitter.publish('loading-channel', false)
    this.load()
  }

  load(){
    const onSuccess = c => users => {
      this.data.users = users
    }

    const onError = c => error => {
      console.error(error)
      this.emitter.publish('notify-error', error.response)
    }

    loadTask(this.http)(this.adminId).fork(onError(this), onSuccess(this))
  }

  next() {
    this.validateUser()
  }

  clearUser() {
    sessionStorage.removeItem('clientId')
    sessionStorage.removeItem('clientName')
    this.state.user = {}
    this.isDisabled = false
  }

  validateUser() {
    const onSuccess = c => validatedUser => {
      this.validatedUser = validatedUser

      validatedUser.id
        ? this.storeUser(validatedUser)
        : this.registerUser(validatedUser)
    }

    const onError = c => error => {
      console.error(error)
      this.emitter.publish('notify-error', error)
    }

    validateUserTask(this.state.user).fork(onError(this), onSuccess(this))
  }

  registerUser(_user) {
    const onError = c => error =>{
      console.error(error)
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = c => user => {
      this.emitter.publish('notify-success', `${user.name} was sucessfully added to the database`)
      this.isDisabled = true
      this.storeUser(user)
    }

    registerTask(this.http)(this.adminId)(_user).fork(onError(this), onSuccess(this))
  }

  storeUser(user) {
    sessionStorage.setItem('clientName', JSON.stringify(user.name))
    sessionStorage.setItem('clientId', JSON.stringify(user.id))
    // this.emitter.publish('show-channel', {user: false})
    this.emitter.publish('show-channel', {tenant: true})
  }

  DropDownChanged(user) {
    user.name === ""
      ? this.clearUser()
      : this.isDisabled = true
    }
 }
