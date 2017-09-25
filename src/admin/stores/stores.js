import { customElement, useView, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { getStoresTask, sortStores, filterStores } from './model'
import { getStoreTask } from './store/model'
import { StorePopup } from './store-popup/store-popup'
import styles from './styles.css'
import { clone, isEmpty } from 'ramda'

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
      filterable:'',
      sortType: 'name',
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

  attached() {
    this.emitterSetup()
    this.getStores()
  }

  getStores() {
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


  sortTypeChanged(sortType) {
    this.filterBy()
    this.state.stores = sortStores(sortType)(this.stores)
    this.state.sortType = sortType
    console.log('sorty type', this.state.sortType)
  }

  filterBy(filterable) {
    isEmpty(this.state.filterable)
      ? this.state.filterable = filterable
      : this.state.filterable = ''
    this.filterChanged(filterable)
  }

  filterChanged(filterable) {
      this.state.stores = filterStores(filterable)(this.stores)
  }


  listHandler(msg) {
    this.state.isList = true
    this.state.listStyle = msg
  }


  emitterSetup() {
    const filterHandler = x => {
      this.state[x.title] = x.msg
      this.filterChanged(this.state.filterable)
    }

    const sortHandler = x => {
      this.state[x.title] = x.msg
      this.sortTypeChanged(this.state.sortType)
    }

    this.emitter.subscribe('sort-channel', sortHandler)
    this.emitter.subscribe('filter-channel', filterHandler)
  }

  reset() {
    this.removeDisposables()
  }

  removeDisposables() {
    this.disposables = new Set();
  }

}