import { useView, inject, bindable } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { checkAuth, checkUserId } from 'authConfig'
import { EventAggregator } from 'aurelia-event-aggregator'
import style from './style.css'

@inject(HttpClient, EventAggregator, Element)
export class NavBar {
  @bindable router
  constructor(http, emitter, el) {
    this.emitter = emitter
    this.authStatus = false
    this.currentUser = ''
    this.http = http
    this.style = style
    this.el = el
    this.isLoading = true
  }

  bind() {
    this.el.querySelector('#p2').style.width = "100%"
    console.log(this.isLoading)


    const handler = authStatus => {
      this.currentUser = checkUserId()
      this.authStatus = authStatus
    }
    const loader = bool =>
      this.isLoading = bool

    this.emitter.subscribe('auth-channel', handler )
    this.emitter.subscribe('loading-channel', loader )

    checkAuth()
    ? this.emitter.publish('auth-channel', true )
    : this.emitter.publish('auth-channel', false )
  }

  logout(){
    Promise.resolve(this.http.get("https://buxy-proxy.herokuapp.com/auth/logout")).then(() => {
      localStorage.removeItem('userId')
      if( !checkAuth() ) this.emitter.publish('auth-channel', false )
      this.router.navigateToRoute('tenantfit')
    })
  }
}
