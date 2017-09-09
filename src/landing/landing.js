import {PLATFORM} from 'aurelia-pal';
import { customElement, useView, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { HttpClient, json } from 'aurelia-http-client'
import { Router } from 'aurelia-router'
import { checkAuth } from 'authConfig'
import { userModel, registerTask, loginTask } from './model'
import { log } from 'utilities'
import { map } from 'ramda'

@customElement('landing')
@useView('./landing.html')
@inject(HttpClient, EventAggregator, Router)
export class Landing {
  constructor(http, emitter, router) {
    this.disposables = new Set()
    this._user = {
      isAdmin: false
    }
    this.state = {}
    this.http = http
    this.router = router
    this.emitter = emitter
    this.style = 'style'
  }

  login() {
    this.user = userModel(this._user)

    const onError = error =>
      console.error(error);

    const onSuccess = data => {
      localStorage.setItem('userId', JSON.stringify(data.userId))
      if ( checkAuth() ) this.emitter.publish('auth-channel', true)
      this.router.navigateToRoute('home', {id: data.userId})
    }


    loginTask(this.http)(this.user).fork(onError, onSuccess)
  }

  register() {
    this.user = userModel(this._user)

    const onError = error =>
      console.error(error);

    const onSuccess = data => {
      log('success')(data)
      localStorage.setItem('userId', JSON.stringify(data._id))
      if ( checkAuth() ) this.emitter.publish('auth-channel', true)
      this.router.navigateToRoute('home', {id: data._id})
    }

    registerTask(this.http)(this.user).fork(onError, onSuccess)
  }

}
