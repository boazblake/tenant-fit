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

    const onSuccess = data => {
      sessionStorage.setItem('userId', JSON.stringify(data.userId))
      sessionStorage.setItem('isAdmin', JSON.stringify(data.isAdmin))

      this.emitter.publish('auth-channel', true)
      console.log(data)
      data.isAdmin
        ? this.router.navigateToRoute('admin', {id: data.userId})
        : this.router.navigateToRoute('home', {id: data.userId})
    }


    loginTask(this.http)(this.user).fork(onError, onSuccess)
  }

}