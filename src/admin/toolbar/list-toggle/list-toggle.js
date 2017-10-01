import { inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'

@inject(EventAggregator)
export class ListToggle {
  constructor(emitter) {
    this.isCard = true
    this.emitter = emitter
  }

  pub() {
    const msg = !this.isCard
    this.isCard = msg
    this.emitter.publish('store-isCard-channel', msg)
  }
}
