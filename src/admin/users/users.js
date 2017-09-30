import { customElement, useView, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getUsersTask } from './model'
import { getUserTask } from './user/model'
import { UserPopup } from './user-popup/user-popup'
import { style } from './style.css'

@customElement('users')
@useView('./users.html')
@inject(EventAggregator, HttpClient, DialogService)
export class Users {
  constructor( emitter, http, modal ) {
    this.disposables = new Set()
    this.users = []
    this.userId = null
    this.state = {}
    this.emitter = emitter
    this.http = http
    this.style = 'style'
    this.modal = modal
    this.errors=[]
    this.style=style
  }

  activate(params){
    this.userId = params.id
  }

  attached(params) {
    const onError = error =>
      console.error(error);

    const onSuccess = data => {
      this.users = data
      this.emitter.publish('loading-channel', false)
    }

    getUsersTask(this.http)(this.userId).fork(onError, onSuccess)
  }

  showUser(id) {
    this.getUser(id)
  }


  getUser(id) {
    const onError = error => {
      console.error(error);
      this.errors.push({type:'users', msg: 'error with getting users'})
    }

    const onSuccess = user => {
      this.user = user
      this.errors['user'] = ''
      this.openModal(id)
      this.emitter.publish('loading-channel', false)
    }

    this.emitter.publish('loading-channel', true)
    getUserTask(this.http)(id).fork(onError, onSuccess)
  }

}
