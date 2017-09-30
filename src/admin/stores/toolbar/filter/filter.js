import { inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'

@inject(EventAggregator)
export class Filter {
  @bindable filters
  constructor(emitter) {
    this.emitter = emitter
  }

  pub(filterable) {
    const msg = this.filter.value

    this.emitter.publish('filter-channel', msg)
  }

}
