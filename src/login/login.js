import { EventAggregator } from 'aurelia-event-aggregator'
import { customElement, useView, inject } from 'aurelia-framework'
import { HttpClient, json } from 'aurelia-http-client'
import {PLATFORM} from 'aurelia-pal';
import { Router } from 'aurelia-router'
import { map } from 'ramda'
import { CheckAuth } from 'authConfig'
import { userModel, registerTask, loginTask } from './model'
import { log } from 'utilities'
import { styles } from './styles.css'

@inject(HttpClient, EventAggregator, Router)
export class Login {
  constructor(http, emitter, router) {
    this.disposables = new Set()
    this._user = {}
    this.state = {}
    this.http = http
    this.router = router
    this.emitter = emitter
    this.styles = styles
  }

  login() {
    this.user = userModel(this._user)

    const onError = c => error => {
      console.error(error)
      c.emitter.publish('notify-error', error.response)
    }

    const onSuccess = c => user => {
      c.emitter.publish('auth-channel', true)
      c.state.user = user
      c.toLogin()
    }

    loginTask(this.http)(this.user).fork(onError(this), onSuccess(this))
  }

  toLogin() {
    this.state.user.isAdmin
      ? this.toAdmin(this.state.user)
      : this.toClient(this.state.user)
  }

  toAdmin(user) {
    sessionStorage.setItem('adminId', JSON.stringify(user.id))
    sessionStorage.setItem('userId', JSON.stringify(user.id))
    sessionStorage.setItem('isAdmin', JSON.stringify(user.isAdmin))
    sessionStorage.setItem('userName', JSON.stringify(user.name))
    this.router.navigateToRoute('admin', {id: user.id})
  }

  toClient(user) {
    sessionStorage.setItem('userName', JSON.stringify(user.name))
    sessionStorage.setItem('userId', JSON.stringify(user.id))
    this.router.navigateToRoute('home', {id: user.id})
  }
}
