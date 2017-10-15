import { DialogService } from 'aurelia-dialog'
import { EventAggregator } from 'aurelia-event-aggregator'
import { customElement, useView, inject, bindable } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import moment from 'moment'
import { clone } from 'ramda'
import { loadTask } from './model.js'
import { UserPopup } from '../user-popup/user-popup'
import styles from './styles.css'
import css from './css.js'
import { log } from 'utilities'

@inject(HttpClient, DialogService, EventAggregator, UserPopup)
export class User {
  @bindable u
  @bindable isCard
  constructor( http, modal, emitter ) {
    this.disposables = new Set()
    this.data = {}
    this.state = {}
    this.http = http
    this.styles = styles
    this.css = css
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

    const onSuccess = c => user => {
      c.data.user = user

      c.state.user = clone(c.data.user)
      c.errors['user'] = ''
      c.emitter.publish('loading-channel', false)
    }

    this.emitter.publish('loading-channel', true)
    loadTask(this.http)(this.u._id)
      .fork(onError(this), onSuccess(this))
  }

  showUser(id) {
    console.log(id)
    this.modal.open( {viewModel: UserPopup, model: id }).whenClosed(response => {
      if (!response.wasCancelled) {
        console.log('updated', response)
        this.data.user = response.output
        this.state.user = clone(this.data.user)
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
  }

  removeDisposables() {
    this.disposables = new Set();
  }

}
