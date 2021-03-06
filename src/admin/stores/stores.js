import { DialogService } from 'aurelia-dialog'
import { EventAggregator } from 'aurelia-event-aggregator'
import { inject } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { clone } from 'ramda'
import {
  loadTask,
  sortTask,
  directionTask,
  filterTask,
  searchTask
} from './model'
import styles from './styles.css'

@inject(EventAggregator, HttpClient, DialogService)
export class Stores {
  constructor(emitter, http) {
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

  activate(params) {
    this.userId = params.id
    this.reset()
    this.orientation()
    this.direction()
    this.sort()
    this.filter()
    this.search()
  }

  attached() {
    this.load()
  }

  orientation() {
    const handler = c => msg => (c.state.isCard = msg)

    this.disposables.add(
      this.emitter.subscribe('isCard-channel', handler(this))
    )
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
      c.emitter.publish('loading-channel', false)
    }

    const handler = c => _ => loadTask(c.http).fork(onError(c), onSuccess(c))

    handler(this)()
  }

  sort() {
    const onError = _ => {}

    const onSuccess = c => results => {
      c.state.stores = results
    }

    const handler = c => msg => {
      c.state.sortBy = msg

      sortTask(c.state.sortBy)(c.state.stores)
        .chain(filterTask(this.state.filterBy))
        .chain(directionTask(c.state.direction))
        .fork(onError, onSuccess(c))
    }

    this.disposables.add(this.emitter.subscribe('sort-channel', handler(this)))
  }

  filter() {
    const onError = _ => {}

    const onSuccess = c => results => (c.state.stores = results)

    const handler = c => msg => {
      c.state.filterBy = msg

      filterTask(c.state.filterBy)(c.data.stores)
        .chain(sortTask(c.state.sortBy))
        .chain(directionTask(c.state.direction))
        .fork(onError, onSuccess(c))
    }

    this.disposables.add(
      this.emitter.subscribe('filter-channel', handler(this))
    )
  }

  direction() {
    const onError = _ => {}

    const onSuccess = c => results => {
      c.state.stores = results
    }

    const handler = c => msg => {
      c.state.direction = msg

      sortTask(c.state.sortBy)(c.data.stores)
        .chain(filterTask(c.state.filterBy))
        .chain(directionTask(c.state.direction))
        .fork(onError, onSuccess(c))
    }

    this.disposables.add(
      this.emitter.subscribe('direction-channel', handler(this))
    )
  }

  search() {
    const onError = _ => {}

    const onSuccess = c => results => (c.state.stores = results)

    const handler = c => msg => {
      c.state.query = msg

      searchTask(c.state.query)(c.data.stores)
        .chain(sortTask(c.state.sortBy))
        .chain(filterTask(c.state.filterBy))
        .chain(directionTask(c.state.direction))
        .fork(onError, onSuccess(c))
    }
    this.disposables.add(
      this.emitter.subscribe('search-channel', handler(this))
    )
  }

  reset() {
    this.state.props.sorters = [
      { key: 'Name', value: 'name' },
      { key: 'Lease Notification Date', value: 'leaseNotifDate' },
      { key: 'Lease Expiration Date', value: 'leaseExpDate' },
      { key: 'Property Location', value: 'propertyName' },
      { key: 'Brand', value: 'brandId' }
    ]

    this.state.props.filters = [
      { key: 'Choose a Filter', value: '' },
      { key: 'Unconfirmed Stores', value: 'isConfirmed' }
    ]
    this.data = {}
    this.state.stores = []
    this.state.sortBy = 'name'
    this.state.filterBy = ''
    this.state.direction = 'asc'
    this.state.query = ''
    this.state.isCard = true
  }

  removeDisposables() {
    this.disposables = new Set()
  }
}
