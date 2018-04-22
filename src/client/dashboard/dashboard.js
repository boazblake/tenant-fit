import { DialogService } from 'aurelia-dialog'
import { EventAggregator } from 'aurelia-event-aggregator'
import { customElement, useView, inject } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { Router } from 'aurelia-router'
import { style } from './styles.css'
import { CheckAuth } from 'authConfig'

const routes = [
  {
    route: 'stores',
    name: 'stores',
    moduleId: PLATFORM.moduleName('../stores/stores'),
    nav: true,
    title: 'STORES',
    settings: { roles: [], icon: 'store' }
  },
  {
    route: 'stores/:id',
    name: 'store-page',
    moduleId: PLATFORM.moduleName('../stores/store-page/store-page'),
    nav: false,
    title: 'STORE PAGE',
    settings: { roles: [] }
  },
    {
    route: 'profile/:id',
    name: 'profile-page',
    moduleId: PLATFORM.moduleName('../profiles/profile-page/profile-page'),
    nav: true,
    href: 'profile-page',
    title: 'PROFILE PAGE',
    settings: { roles: [] }
  },
  {
    route: '',
    redirect: 'stores'
  }
]

@inject(HttpClient, DialogService, EventAggregator)
export class Dashboard {
  constructor(http, modal, emitter) {
    this.disposables = new Set()
    this.state = {}
    this.http = http
    this.style = style
    this.modal = modal
    this.errors = []
    this.emitter = emitter
  }

  configureRouter(config, router) {
    config.title = 'CLIENT CHILD ROUTER'
    config.map(routes)
    this.router = router
  }

  activate() {
    this.userId = CheckAuth.userId()
  }

  attached(params) {}
}
