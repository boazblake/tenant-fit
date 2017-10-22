import { inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'

@inject(EventAggregator)
export class AddItem {
  constructor(emitter) {
    this.emitter = emitter
  }

  pub() {
    this.emitter.publish('add-item-channel', true)
  }
}
