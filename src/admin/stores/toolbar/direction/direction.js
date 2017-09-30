import { inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'

@inject(EventAggregator)
export class Direction {
  constructor(emitter) {
    this.isAscending = false
    this.emitter = emitter
  }

  pub() {
    this.isAscending = !this.isAscending
    const msg = this.isAscending ? 'asc' : 'dsc'
    this.emitter.publish('direction-channel', msg)
  }
}
