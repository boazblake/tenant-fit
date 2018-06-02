import { EventAggregator } from 'aurelia-event-aggregator'
import { inject } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { Router } from 'aurelia-router'
import { CheckAuth } from 'authConfig'
import { userModel, loginTask } from './model'
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
    console.log(CheckAuth)
    CheckAuth.toAdmin(user.id)
    CheckAuth.toUserId(user.id)
    CheckAuth.toUserName(user.name)
    console.log(CheckAuth.userId())

    this.router.navigateToRoute('admin', { id: CheckAuth.userId() })
  }

  toClient(user) {
    CheckAuth.toUserName(user.name)
    CheckAuth.toUserId(user.id)
    this.router.navigateToRoute('client', { id: CheckAuth.userId() })
  }
}
