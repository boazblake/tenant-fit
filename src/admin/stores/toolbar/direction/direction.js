import { inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'

@inject(EventAggregator)
export class Direction {
  constructor(emitter) {
    this.isAscending = true
    this.emitter = emitter
  }

  pub() {
    const msg = this.isAscending ? 'dsc' : 'asc'
    console.log('pub dir', msg)
    this.emitter.publish('direction-channel', msg)
    this.isAscending = !this.isAscending
  }
}
