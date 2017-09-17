import {PLATFORM} from 'aurelia-pal';
import { customElement, useView, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { HttpClient, json } from 'aurelia-http-client'
import { Router } from 'aurelia-router'
import { CheckAuth } from 'authConfig'
import { userModel, registerTask, loginTask } from './model'
import { log } from 'utilities'
import { map } from 'ramda'
import { style } from './style.css'

@customElement('landing')
@useView('./landing.html')
@inject(HttpClient, EventAggregator, Router)
export class Landing {
  constructor(http, emitter, router) {
    this.disposables = new Set()
    this._user = {}
    this.state = {}
    this.http = http
    this.router = router
    this.emitter = emitter
    this.style = style
  }

  login() {
    this.user = userModel(this._user)

    const onError = error =>{
      console.error(error)
      this.emitter.publish('notify-error', error.response)
    }

    const onSuccess = user => {
      this.emitter.publish('auth-channel', true)
      this.state.user = user
      this.toLogin()
    }

    loginTask(this.http)(this.user).fork(onError, onSuccess)
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
    console.log('toclient', user)
    sessionStorage.setItem('userName', JSON.stringify(user.name))
    sessionStorage.setItem('userId', JSON.stringify(user.id))
    this.router.navigateToRoute('home', {id: user.id})
  }
}