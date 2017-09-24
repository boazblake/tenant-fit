import { customElement, useView, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getStoresTask, sortStores } from './model'
import { getStoreTask } from './store/model'
import { StorePopup } from './store-popup/store-popup'
import styles from './styles.css'
import { clone } from 'ramda'

@customElement('stores')
@useView('./stores.html')
@inject(EventAggregator, HttpClient, DialogService)
export class Stores {
  constructor( emitter, http, modal ) {
    this.disposables = new Set()
    this.stores = []
    this.userId = null
    this.data = {}
    this.state = {
      sortType: 'name',
      listStyle: 'list',
      isList: false
    }
    this.emitter = emitter
    this.http = http
    this.errors=[]
    this.styles = styles
  }

  activate(params){
    this.reset()
    this.userId = params.id
  }

  attached(params) {
    const onError = error =>
      console.error(error);

    const onSuccess = stores => {
      this.data.stores = stores
      this.stores = clone(this.data.stores)
      this.state.stores = sortStores(this.state.sortType)(this.stores)
      this.emitter.publish('loading-channel', false)
    }

    getStoresTask(this.http)(this.userId).fork(onError, onSuccess)
  }

  showStore(id) {
    this.getStore(id)
  }


  getStore(id) {
    const onError = error => {
      console.error(error);
      this.errors.push({type:'stores', msg: 'error with getting stores'})
    }

    const onSuccess = store => {
      this.store = store
      this.errors['store'] = ''
      this.openModal(id)
      this.emitter.publish('loading-channel', false)
    }

    this.emitter.publish('loading-channel', true)
    getStoreTask(this.http)(id).fork(onError, onSuccess)
  }


  toggleList() {
    this.state.isList = !this.state.isList
    this.emitter.publish('list-channel', true)
    this.toggleListIcon()
  }

  toggleListIcon(){
    this.state.isList
    ? this.state.listStyle = 'list'
    : this.state.listStyle = ''
  }

  sortBy(sortType) {
    this.state.stores = sortStores(sortType)(this.stores)
    this.state.sortType = sortType
    console.log(this.state.sortType)
  }

  listHandler(msg) {
    this.state.isList = true
    this.state.listStyle = msg
  }

  reset() {

  }

}