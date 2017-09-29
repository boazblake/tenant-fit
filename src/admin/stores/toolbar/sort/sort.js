import { inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'

@inject(EventAggregator)
export class Sort {
  @bindable sorters
  constructor(emitter) {
    this.emitter = emitter
  }

  sortTypeChanged(sortType) {
    this.emitter.publish('sort-channel', {title:'sortType', msg:sortType.type})
  }
}
