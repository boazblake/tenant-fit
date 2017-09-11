import { customElement, useView, inject } from 'aurelia-framework'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getTenantsTask, addTypeTask} from './model'
import { getStoresTask } from '../stores/model'
import style from './styles.css'
import { Prompt } from '../components/modal'
import { checkUserId } from 'authConfig'


@customElement('admin')
@useView('./admin.html')
@inject(HttpClient, DialogService)
export class Admin {
  constructor( http, modal ) {
    this.disposables = new Set()
    this.admin = []
    this.stores = []
    this.userId = null
    this.state = {}
    this.http = http
    this.style = style
    this.modal = modal
    this.tenant = {name:'', userId:this.userId}
    this.store = {name:'', tenantId:'59b1f19cc64207001110f20f', userId:this.userId}
    this.errors = []
  }

  activate(){
    this.userId = checkUserId()
    console.log(this.userId);
  }

  attached(params) {
    const onError = error => {
      console.error(error);
      this.errors.push({type:'attached', msg: 'error with attached'})
    }

    const onSuccess = data =>{
      console.log(data);
      this.admin = data
      this.errors['attached'] = ''
    }

    getTenantsTask(this.http)(this.userId).fork(onError, onSuccess)
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

  getStores(id) {
    const onError = error => {
      console.error(error);
      this.errors.push({type:'stores', msg: 'error with getting stores'})
    }

    const onSuccess = stores => {
      this.stores = stores
      this.errors['store'] = ''
    }

    getStoresTask(this.http)(id).fork(onError, onSuccess)
  }

  openModal() {
      this.modal.open( {viewModel: Prompt, model: 'Are you sure?' }).then(response => {
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
