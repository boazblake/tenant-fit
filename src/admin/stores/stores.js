import { customElement, useView, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { loadTask, sortTask, directionTask, filterStores, searchTask } from './model'
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
      filterable: '',
      isList: false
    }
    this.emitter = emitter
    this.http = http
    this.errors = []
    this.styles = styles
  }

  activate(params){
    this.reset()
    this.userId = params.id
  }

  attached() {
    // this.emitterSetup()
    this.load()
    this.direction()
    this.sort()
    this.search()
  }

  detached() {
    this.disposables.forEach(x => x.dispose())
  }

  load() {
    const onError = error =>
      console.error(error);

    const onSuccess = stores => {
      this.data.stores = stores
      this.state.stores = clone(stores)

      this.emitter.publish('sort-channel', 'name')
      this.emitter.publish('loading-channel', false)
    }

    const handler = c => _ =>
      loadTask(c.http)(c.userId).fork(onError, onSuccess)

    handler(this)()
  }

  sort() {
    const onError = _ => {}

    const onSuccess = c => results => (c.state.stores = results)

    const handler = c => msg => {
      c.state.sortBy = msg

      sortTask(c.state.sortBy)(c.state.stores)
        .chain(directionTask(c.state.direction))
        .fork(onError, onSuccess)
    }

    this.disposables.add(this.emitter.subscribe('sort-channel', handler(this)))
  }

  direction() {
    const onError = _ => {}

    const onSuccess = c => results => {
      c.state.stores = results
      c.data.stores = results
    }

    const handler = c => msg => {
      c.state.direction = msg

      sortTask(c.state.prop)(c.state.stores)
        .chain(directionTask(c.state.direction))
        .fork(onError, onSuccess(c))
    }

    this.disposables.add(this.emitter.subscribe('direction-channel', handler(this)))
  }

  search() {
    const onError = _ => {}

    const onSuccess = c => results => (c.state.stores  = results)

    const handler = c => msg => {
      c.state.query = msg

      searchTask(c.state.query)(c.data.stores)
        .chain(sortTask(c.state.prop))
        .chain(directionTask(c.state.direction))
        .fork(onError, onSuccess(c))
    }
    this.disposables.add(this.emitter.subscribe('search-channel', handler(this)))
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

  //
  // sortTypeChanged(sortType) {
  //   this.filterBy()
  //   this.state.stores = sortStores(sortType)(this.stores)
  //   this.state.sortType = sortType
  //   console.log('sorty type', this.state.sortType)
  // }
  //
  // filterBy(filterable) {
  //   isEmpty(this.state.filterable)
  //     ? this.state.filterable = filterable
  //     : this.state.filterable = ''
  //   this.filterChanged(filterable)
  // }
  //
  // filterChanged(filterable) {
  //   this.state.stores = filterStores(filterable)(this.stores)
  // }
  //
  //
  // listHandler(msg) {
  //   this.state.isList = true
  //   this.state.listStyle = msg
  // }
  //
  // emitterSetup() {
  //   const filterHandler = x => {
  //     this.state[x.title] = x.msg
  //     this.filterChanged(this.state.filterable)
  //   }
  //
  //   const sortHandler = x => {
  //     this.state[x.title] = x.msg
  //     this.sortTypeChanged(this.state.sortType)
  //   }
  //
  //   const searchHandler = msg => {
  //     const onError = x => console.log(x)
  //
  //     const onSuccess = results =>
  //       this.state.stores = results
  //
  //     this.state.query = msg
  //     searchTask(this.state.query)(this.stores).fork(onError, onSuccess)
  //   }
  //
  //   this.emitter.subscribe('sort-channel', sortHandler)
  //   this.emitter.subscribe('filter-channel', filterHandler)
  //   this.emitter.subscribe('search-channel', searchHandler)
  // }

  reset() {
    this.removeDisposables()
  }

  removeDisposables() {
    this.disposables = new Set();
  }

}
