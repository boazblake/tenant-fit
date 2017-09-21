import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getUserTask } from './model.js'
import { styles } from './styles.css'
import { UserPopup } from '../user-popup/user-popup'
import { clone } from 'ramda'
import { CheckAuth } from 'authConfig'

@customElement('user')
@useView('./user.html')
@inject(HttpClient, DialogService, EventAggregator, UserPopup)
export class User {
  @bindable u
  constructor( http, modal, emitter ) {
    this.disposables = new Set()
    this.data = {}
    this.state = {}
    this.http = http
    this.style = styles
    this.emitter = emitter
    this.errors = {}
    this.modal = modal
  }

  attached() {
    this.adminId = CheckAuth.adminId()
    this.reset()
    this.getUser(this.u._id)
  }

  getUser(id) {
    const onError = error => {
      console.error(error);
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = user => {
      this.data.user = user
      this.state.user = clone(this.data.user)
      this.errors['user'] = ''
      this.emitter.publish('loading-channel', false)
    }

    this.emitter.publish('loading-channel', true)
    getUserTask(this.http)(this.adminId)(id).fork(onError, onSuccess)
  }

  showUser(id) {
    console.log(id)
    this.modal.open( {viewModel: UserPopup, model: id }).whenClosed(response => {
      if (!response.wasCancelled) {
        console.log('updated')
        this.data.user = response.output
        this.state.user = clone(this.data.user)
      } else {
        console.log('not updated')
      }
    })
  }


  reset() {
  }

}