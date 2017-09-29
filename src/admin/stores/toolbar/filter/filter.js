import { inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'

@inject(EventAggregator)
export class Filter {
  @bindable filters
  constructor(emitter) {
    this.emitter = emitter
  }

  filterChanged(filterable) {
    this.emitter.publish('filter-channel', {title:'filterable', msg:filterable.type})
  }

}
