import { customElement, useView, inject } from 'aurelia-framework'
import { DialogService } from 'aurelia-dialog'
import { EventAggregator } from 'aurelia-event-aggregator'
import { HttpClient } from 'aurelia-http-client'
import { getTenantsTask, addTypeTask} from './model'
import { getStoresTask } from '../stores/model'
import style from './styles.css'
import { CheckAuth } from 'authConfig'


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

  activate(){
    this.userId = CheckAuth.userId()
    console.log(this.userId);
  }

  attached(params) {
    this.getTenants()
    this.getStores()
  }

  getTenants() {
    const onError = error => {
      console.error(error);
      this.errors.push({type:'attached', msg: 'error with attached'})
    }

    const onSuccess = data =>{
      console.log(data);
      this.tenants = data
      this.errors['attached'] = ''
    }

    getTenantsTask(this.http)(this.userId).fork(onError, onSuccess)
  }

  getStores() {
    const onError = error => {
      console.error(error);
      this.errors.push({type:'stores', msg: 'error with getting stores'})
    }

    const onSuccess = stores => {
      this.stores = stores
      this.errors['store'] = ''
      this.emitter.publish('loading-channel', false)

    }
    console.log(CheckAuth.isAdmin())

    CheckAuth.isAdmin()
      ? getStoresTask(this.http)(this.userId).fork(onError, onSuccess)
      : console.log('not allowed')
  }

  addTenant(){
    const onError = error => {
      console.error(error);
      this.errors.push({type:'tenant', msg: 'error with addign a tenant'})
    }

    const onSuccess = s => {
      console.log('success', s)
      this.errors['admin'] = ''
    }
    this.tenant.userId = this.userId
    addTypeTask('admin')(this.http)(this.userId)(this.tenant).fork(onError, onSuccess)
  }

  addStore(){
    const onError = error => {
      console.error(error);
      this.errors.push({type:'store', msg: 'error with adding a store'})
    }

    const onSuccess = s => {
      console.log('success', s)
      this.errors['stores'] = ''
    }

    addTypeTask('stores')(this.http)(this.userId)(this.store).fork(onError, onSuccess)
  }

  // register() {
  //   this.user = userModel(this._user)
  //
  //   const onError = error =>{
  //   console.error(error)
  //   this.emitter.publish('notify-error', error.response)
  // }
  //   const onSuccess = data => {
  //     log('success')(data)
  //     sessionStorage.setItem('userId', JSON.stringify(data._id))
  //     if ( CheckAuth.auth() ) this.emitter.publish('auth-channel', true)
  //     this.router.navigateToRoute('home', {id: data._id})
  //   }
  //
  //   registerTask(this.http)(this.user).fork(onError, onSuccess)
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