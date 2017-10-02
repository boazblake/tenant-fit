import { useView, inject, bindable } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { CheckAuth } from 'authConfig'
import { EventAggregator } from 'aurelia-event-aggregator'
import styles from './styles.css'

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
    this.styles = styles
    this.el = el
    this.isLoading = true
  }

  bind() {
    // this.el.querySelector('#p2').style.width = "100%"

    const handler = authStatus => {
      this.state.currentUser = CheckAuth.userName()
      this.state.authStatus = CheckAuth.auth()
      this.state.adminStatus = CheckAuth.isAdmin()
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
    sessionStorage.clear()
    Promise.resolve(this.http.get("http://localhost:8080/auth/logout")).then(() => {
      if(! CheckAuth.auth() ) this.emitter.publish('auth-channel', false )
      this.router.navigateToRoute('tenantfit')
    })
  }
}
