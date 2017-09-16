import { customElement, useView, inject } from 'aurelia-framework'
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
export class AddUser {
  constructor( http, modal, emitter ) {
    this.disposables = new Set()
    this.userId = null
    this.data ={
      users:[]
    }
    this.state = {
      user: {}
    }
    this.http = http
    this.styles = styles
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

  clearUser() {
    this.state.user.addUser = null
  }

  validateUser() {
    const onSuccess = validatedUser => {
      this.validatedUser = validatedUser
      log('user')(validatedUser)

      validatedUser.id
        ? this._user = validatedUser
        : this._user = this.registerUser(validatedUser)
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

    const onSuccess = data => {
      log('success')(data)
      this.emitter.publish('notify-success', `${data.name} was sucessfully added to the database`)
      sessionStorage.setItem('userId', JSON.stringify(data._id))
      if ( CheckAuth.auth() ) this.emitter.publish('auth-channel', true)
      this.router.navigateToRoute('home', {id: data._id})
    }
    console.log(_user)
    registerTask(this.http)(_user).fork(onError, onSuccess)
  }
 }