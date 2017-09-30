import { customElement, useView, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { loadTask, sortTask, directionTask, filterTask, searchTask } from './model'
import { getStoreTask } from './store/model'
import { StorePopup } from './store-popup/store-popup'
import styles from './styles.css'
import { clone, isEmpty } from 'ramda'
import { log } from 'utilities'

@inject(EventAggregator, HttpClient, DialogService)
export class Stores {
  constructor( emitter, http, modal ) {
    this.disposables = new Set()
    this.stores = []
    this.userId = null
    this.data = {}
    this.state = {
      props: {}
    }
    this.emitter = emitter
    this.http = http
    this.errors = []
    this.styles = styles
  }

  orientation() {
    const onError = _ => {}

    const onSuccess = c => msg => {
      c.state.isCard = msg
    }

    const handler = c => msg => {
      c.state.isCard = msg
    }

    this.disposables.add(this.emitter.subscribe('store-isCard-channel', handler(this)))
  }

  activate(params){
    this.userId = params.id
    this.reset()
    this.direction()
    this.sort()
    this.filter()
    this.search()
    this.orientation()
  }

  attached() {
    this.load()
  }

  detached() {
    this.disposables.forEach(x => x.dispose())
  }

  load() {
    const onError = c => error => {
      console.error(error)
      c.emitter.publish('notify-error', error.response)
    }

    const onSuccess = c => stores => {
      c.data.stores = stores
      c.stores = clone(stores)
      c.state.stores = clone(stores)
      c.emitter.publish('filter-channel', c.state.filterBy)
      c.emitter.publish('sort-channel', c.state.sortBy)
      c.emitter.publish('direction-channel', c.state.direction)
      c.emitter.publish('store-isCard-channel', c.state.isCard)
      c.emitter.publish('loading-channel', false)
    }

    const handler = c => _ =>
      loadTask(c.http)(c.userId).fork(onError(c), onSuccess(c))

    handler(this)()
  }

  sort() {
    const onError = _ => {}

    const onSuccess = c => results =>{
      c.state.stores = results
    }

    const handler = c => msg => {
      c.state.sortBy = msg

      sortTask(c.state.sortBy)(c.state.stores)
        .chain(directionTask(c.state.direction))
        .fork(onError, onSuccess(c))
    }

    this.disposables.add(this.emitter.subscribe('sort-channel', handler(this)))
  }

  filter() {
    const onError = _ => {}

    const onSuccess = c => results => {
      c.state.stores = results
    }

    const handler = c => msg => {
      c.state.filterBy = msg

      filterTask(c.state.filterBy)(c.data.stores)
      .chain(sortTask(c.state.sortBy))
        .chain(directionTask(c.state.direction))
        .fork(onError, onSuccess(c))
    }

    this.disposables.add(this.emitter.subscribe('filter-channel', handler(this)))
  }

  direction() {
    const onError = _ => {}

    const onSuccess = c => results => {
      c.state.stores = results
    }

    const handler = c => msg => {
      c.state.direction = msg

      sortTask(c.state.sortBy)(c.state.stores)
      .chain(filterTask(c.state.filterBy))
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
        .chain(sortTask(c.state.sortBy))
        .chain(directionTask(c.state.direction))
        .fork(onError, onSuccess(c))
    }
    this.disposables.add(this.emitter.subscribe('search-channel', handler(this)))
  }

  showStore(id) {
    this.getStore(id)
  }

  getStore(id) {
    const onError = c => error => {
      console.error(error);
      c.errors.push({type:'stores', msg: 'error with getting stores'})
    }

    const onSuccess = c => store => {
      c.store = store
      c.errors['store'] = ''
      c.openModal(id)
      c.emitter.publish('loading-channel', false)
    }

    this.emitter.publish('loading-channel', true)
    getStoreTask(this.http)(id).fork(onError(this), onSuccess(this))
  }

  reset() {
    this.state.props.sorters = [
      { key: 'Name', value: 'name' },
      { key: 'Lease Notification Date', value: 'leaseNotifDate' },
      { key: 'Lease Expiration Date', value: 'leaseExpDate' }
    ]

    this.state.props.filters = [
      {key: 'Choose a Filter', value: ''},
      {key: 'Unconfirmed Stores', value: 'isConfirmed'}
    ]
    this.data = {}
    this.state.stores = []
    this.state.sortBy = 'name'
    this.state.filterBy = ''
    this.state.direction = 'asc'
    this.state.query = ''
    this.state.isCard = 'true'
  }


  removeDisposables() {
    this.disposables = new Set();
  }

}
