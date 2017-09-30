import { inject, bindable } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { clone } from 'ramda'

@inject(EventAggregator)
export class Toolbar {
  constructor(emitter) {
    this.emitter = emitter
  }

  filterChanged(filterable) {
    this.emitter.publish('filter-channel', {title:'filterable', msg:filterable.type})
  }

  sortTypeChanged(sortType) {
    this.emitter.publish('sort-channel', {title:'sortType', msg:sortType.type})
  }

  search() {
    const msg = clone(this.query)
    this.emitter.publish('search-channel', msg)
    console.log(msg)
  }
}
