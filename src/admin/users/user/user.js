import { DialogService } from 'aurelia-dialog'
import { EventAggregator } from 'aurelia-event-aggregator'
import { inject, bindable } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { clone } from 'ramda'
import { loadTask } from './model.js'
import { UserPage } from '../user-page/user-page'
import styles from './styles.css'
import css from './css.js'

@inject(HttpClient, DialogService, EventAggregator, UserPage)
export class User {
  @bindable u
  @bindable isCard
  constructor(http, modal, emitter) {
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
      console.error(error)
      c.emitter.publish('notify-error', error.response)
    }

    const onSuccess = c => user => {
      c.data.user = user

      c.state.user = clone(c.data.user)
      c.errors['user'] = ''
      c.emitter.publish('loading-channel', false)
    }

    this.emitter.publish('loading-channel', true)
    loadTask(this.http)(this.u._id)(this.adminId).fork(
      onError(this),
      onSuccess(this)
    )
  }

  showUser(id) {
    this.router.navigateToRoute('user-page', { id })
  }

  multiSelect() {
    const handler = c => msg => (c.isSelectable = msg)

    this.disposables.add(
      this.emitter.subscribe('multiSelect-channel', handler(this))
    )
  }

  selected() {
    if (this.isSelectable) {
      return (this.isSelected = !this.isSelected)
    }
  }

  reset() {
    this.isSelectable = false
    this.isSelected = false
  }

  removeDisposables() {
    this.disposables = new Set()
  }
}
