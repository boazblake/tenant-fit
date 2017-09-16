import { customElement, useView, inject } from 'aurelia-framework'
import { DialogService } from 'aurelia-dialog'
import { Router } from 'aurelia-router'
import { EventAggregator } from 'aurelia-event-aggregator'
import { HttpClient } from 'aurelia-http-client'
import { getTenantsTask, addTypeTask} from './model'
import { getStoresTask } from '../stores/model'
import { style } from './styles.css'
import { CheckAuth } from 'authConfig'


const routes =
[ { route: 'stores'
  , name: 'stores'
  , moduleId: PLATFORM.moduleName('../stores/stores')
  , nav: true
  , title: 'STORES'
  , settings: { roles: [] }
  }
, { route:'add-store'
  , name: 'addUser'
  , moduleId: PLATFORM.moduleName('../add-store/add-store')
  , nav: true
  , title:'ADD A STORE'
  , settings: { roles: [] }
  }
, { route: ''
  , redirect: 'stores'
  }
]



@customElement('dashboard')
@useView('./dashboard.html')
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

  // addTenant(){
  //   const onError = error => {
  //     console.error(error);
  //     this.errors.push({type:'tenant', msg: 'error with addign a tenant'})
  //   }
  //
  //   const onSuccess = s => {
  //     console.log('success', s)
  //     this.errors['admin'] = ''
  //   }
  //   this.tenant.userId = this.userId
  //   addTypeTask('admin')(this.http)(this.userId)(this.tenant).fork(onError, onSuccess)
  // }
  //
  // addStore(){
  //   const onError = error => {
  //     console.error(error);
  //     this.errors.push({type:'store', msg: 'error with adding a store'})
  //   }
  //
  //   const onSuccess = s => {
  //     console.log('success', s)
  //     this.errors['stores'] = ''
  //   }
  //
  //   addTypeTask('stores')(this.http)(this.userId)(this.store).fork(onError, onSuccess)
  // }



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