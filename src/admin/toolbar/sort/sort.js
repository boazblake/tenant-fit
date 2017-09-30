import { inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'

@inject(EventAggregator)
export class Sort {
  @bindable sorters
  constructor(emitter) {
    this.emitter = emitter
  }

  pub() {
    const msg = this.sorter.value
    this.emitter.publish('sort-channel', msg)
  }
}
