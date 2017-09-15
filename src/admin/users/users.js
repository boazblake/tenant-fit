import { customElement, useView, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import style from './styles.css'


@customElement('users')
@useView('./users.html')
@inject(HttpClient, DialogService, EventAggregator)
export class Users {
  constructor( http, modal, emitter ) {
    this.disposables = new Set()
    this.users = []
    this.userId = null
    this.state = {}
    this.http = http
    this.style = style
    this.modal = modal
    this.errors = []
    this.emitter = emitter
  }

  attached(){
    this.emitter.publish('loading-channel', false)
    console.log('user attached')
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