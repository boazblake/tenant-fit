import { EventAggregator } from 'aurelia-event-aggregator'
import { bindable, inject } from 'aurelia-framework'
import { clone } from 'ramda'

@inject(EventAggregator)
export class Locker {
  @bindable isLocked

  constructor(emitter) {
    this.emitter = emitter
  }

  do() {
    this.lock()
  }

  lock() {
    this.emitter.publish('lock-channel', !this.isLocked)
  }
}
