import { DialogService } from 'aurelia-dialog'
import { EventAggregator } from 'aurelia-event-aggregator'
import { customElement, useView, inject } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { Router } from 'aurelia-router'
import { style } from './styles.css'
import { CheckAuth } from 'authConfig'


const routes =
[ { route: 'stores'
  , name: 'stores'
  , moduleId: PLATFORM.moduleName('../stores/stores')
  , nav: true
  , title: 'STORES'
  , settings: { roles: [], icon:'store' }
  }
, { route:'add-store'
  , name: 'addStore'
  , moduleId: PLATFORM.moduleName('../add-store/add-store')
  , nav: true
  , title:'ADD A STORE'
  , settings: { roles: [] }
  }
, { route: 'users'
  , name: 'users'
  , moduleId: PLATFORM.moduleName('../users/users')
  , nav: true
  , title: 'USERS'
  , settings: { roles: [] }
  }
, { route: 'users/:id'
  , name: 'user-page'
  , moduleId: PLATFORM.moduleName('../users/user-page/user-page')
  , nav: false
  , title: 'USER PAGE'
  , settings: { roles: [] }
  }
, { route: ''
  , redirect: 'stores'
  }
]



@inject(HttpClient, DialogService, EventAggregator)
export class Dashboard {
  constructor( http, modal, emitter) {
    this.disposables = new Set()
    this.state = {}
    this.http = http
    this.style = style
    this.modal = modal
    this.errors = []
    this.emitter = emitter
  }

  configureRouter(config, router) {
    config.title = 'ADMIN CHILD ROUTER'
    config.map(routes)

    this.router = router
  }

  activate(){
    this.userId = CheckAuth.userId()
  }

  attached(params) {
  }

  openModal() {
      this.modal.open( {viewModel: '', model: 'Are you sure?' }).then(response => {
         console.log(response);

         if (!response.wasCancelled) {
            console.log('OK');
         } else {
            console.log('cancelled');
         }
         console.log(response.output);
      });
   }


 }