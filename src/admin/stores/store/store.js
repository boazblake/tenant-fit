import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { loadTask } from './model.js'
import styles from './styles.css'
import { StorePopup } from '../store-popup/store-popup'
import { clone } from 'ramda'
import moment from 'moment'
import {test} from test


@customElement('store')
@useView('./store.html')
@inject(HttpClient, DialogService, EventAggregator, StorePopup)
export class Store {
  @bindable s
  constructor( http, modal, emitter ) {
    this.disposables = new Set()
    this.data = {}
    this.state = {}
    this.http = http
    this.styles = styles
    this.emitter = emitter
    this.errors = {}
    this.modal = modal
  }

  attached() {
    this.reset()
    this.orientation()
    this.multiSelect()
    this.load()
    this.background()
  }

  load() {
    const onError = c => error => {
      console.error(error);
      c.emitter.publish('notify-error', error.response)
    }

    const onSuccess = c =>  store => {
      c.data.store = store
      c.state.store = clone(c.data.store)
      c.errors['store'] = ''
      c.emitter.publish('loading-channel', false)
      c.emitter.publish('store-isCard-channel', c.state.isCard)

    }

    this.emitter.publish('loading-channel', true)
    loadTask(this.http)(this.s._id).fork(onError(this), onSuccess(this))
  }

  background() {
    this.styles.background = 'red'

    console.log(moment.now())
  }

  orientation() {
    const handler = c => msg =>
      c.state.isCard = msg

    this.disposables.add(this.emitter.subscribe('store-isCard-channel', handler(this)))
  }

  showStore(id) {
    console.log(id)
    this.modal.open( {viewModel: StorePopup, model: id }).whenClosed(response => {
      if (!response.wasCancelled) {
        console.log('updated', response)
        this.data.store = response.output
        this.state.store = clone(this.data.store)
      } else {
        console.log('not updated', response)
      }
    })
  }

  multiSelect() {
    const handler = c => msg =>
      c.isSelectable = msg

    this.disposables.add(this.emitter.subscribe('multiSelect-channel', handler(this)))
  }

  selected() {
    if (this.isSelectable) {
      return this.isSelected = ! this.isSelected
    }
  }

  reset() {
    this.state.isCard = true
    this.isSelectable = false
    this.isSelected = false
  }

  removeDisposables() {
    this.disposables = new Set();
  }

}
