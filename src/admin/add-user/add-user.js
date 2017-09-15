import { customElement, useView, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getUsersTask, validateUserTask } from './model'
import { CheckAuth } from 'authConfig'
import style from './styles.css'
import { log } from 'utilities'


@customElement('add-user')
@useView('./add-user.html')
@inject(HttpClient, DialogService, EventAggregator)
export class AddUser {
  constructor( http, modal, emitter ) {
    this.disposables = new Set()
    this.userId = null
    this.data ={
      users:[]
    }
    this.state = {
      user: {
        
      }
    }
    this.http = http
    this.style = style
    this.modal = modal
    this.errors = []
    this.emitter = emitter
  }

  attached(){
    this.userId = CheckAuth.userId()

    this.emitter.publish('loading-channel', false)
    this.getUsers()
  }

  getUsers(){
    const onSuccess = users => {
      this.data.users = users
      log('USERS')(this.data.users)
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

  validateUser() {
    const onSuccess = validatedUser => {
      this.validatedUser = validatedUser
      log('user')(validatedUser)
      this.emitter.publish('notify-success', validatedUser.name)

    }

    const onError = error => {
      console.error(error)
      this.emitter.publish('notify-error', error)
    }
    log('this.state.user')(this.state.user)
    validateUserTask(this.state.user).fork(onError, onSuccess)
  }

  registerUser() {
    this.user = userModel(this._user)

    const onError = error =>{
    console.error(error)
    this.emitter.publish('notify-error', error.response)
  }
    const onSuccess = data => {
      log('success')(data)
      sessionStorage.setItem('userId', JSON.stringify(data._id))
      if ( CheckAuth.auth() ) this.emitter.publish('auth-channel', true)
      this.router.navigateToRoute('home', {id: data._id})
    }

    registerTask(this.http)(this.user).fork(onError, onSuccess)
  }
 }