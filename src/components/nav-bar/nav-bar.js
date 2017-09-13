import { useView, inject, bindable } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { CheckAuth } from 'authConfig'
import { EventAggregator } from 'aurelia-event-aggregator'
import style from './style.css'

@inject(HttpClient, EventAggregator, Element)
export class NavBar {
  @bindable router
  constructor(http, emitter, el) {
    this.emitter = emitter
    this.state = {
      authStatus : false,
      adminStatus : false,
      currentUser : ''
    }
    this.http = http
    this.style = style
    this.el = el
    this.isLoading = true
  }

  bind() {
    this.el.querySelector('#p2').style.width = "100%"

    const handler = authStatus => {
      this.currentUser = CheckAuth.userId()
      this.authStatus = CheckAuth.auth()
      this.adminStatus = CheckAuth.isAdmin()
    }

    const loader = bool =>
      this.isLoading = bool

    this.emitter.subscribe('auth-channel', handler )
    this.emitter.subscribe('loading-channel', loader )

    CheckAuth.auth()
    ? this.emitter.publish('auth-channel', true )
    : this.emitter.publish('auth-channel', false )
  }

  logout(){
    Promise.resolve(this.http.get("http://localhost:8080/auth/logout")).then(() => {
      sessionStorage.clear()
      if( ! CheckAuth.auth() ) this.emitter.publish('auth-channel', false )
      this.router.navigateToRoute('tenantfit')
    })
  }
}