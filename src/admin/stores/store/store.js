import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { HttpClient } from 'aurelia-http-client'
import { loadTask, findColor } from './model.js'
import styles from './styles.css'
import { StorePopup } from '../store-popup/store-popup'
import { clone } from 'ramda'
import moment from 'moment'
// import {test} from test


@inject(HttpClient, DialogService, EventAggregator, StorePopup)
export class Store {
  @bindable s
  @bindable isCard
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
    this.multiSelect()
    this.load()
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
      c.background()
    }

    this.emitter.publish('loading-channel', true)
    loadTask(this.http)(this.s._id).fork(onError(this), onSuccess(this))
  }


  background() {
    const today = moment()
    const daysToNotif = moment(this.state.store.leaseNotificationDate).diff(today, 'days')

    const todaysColor = findColor(daysToNotif)

    console.log('todaysColor', todaysColor)

    this.background = todaysColor

    // console.log(moment.now())
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
    this.isSelectable = false
    this.isSelected = false
    // this.isCard = this.isCard === undefined ? true : this.isCard
  }

  removeDisposables() {
    this.disposables = new Set();
  }

}
