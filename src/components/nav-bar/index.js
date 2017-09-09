import { useView, inject, bindable } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { checkAuth, checkUserId } from 'authConfig'
import { EventAggregator } from 'aurelia-event-aggregator'
import styles from './styles.css'

@inject(HttpClient, EventAggregator)
export class NavBar {
  @bindable router
  constructor(http, emitter) {
    this.emitter = emitter
    this.authStatus = false
    this.currentUser = ''
    this.http = http
    this.styles = styles
  }

  bind() {
    const handler = authStatus => {
      this.currentUser = checkUserId()
      this.authStatus = authStatus
    }

    this.emitter.subscribe('auth-channel', handler )

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
