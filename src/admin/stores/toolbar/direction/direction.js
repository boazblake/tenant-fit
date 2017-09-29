import { inject } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { EventAggregator } from 'aurelia-event-aggregator'

@inject(HttpClient, EventAggregator)
export class Direction {
  constructor(http, emitter) {
    this.isAscending = true
    this.emitter = emitter
  }

  pub() {
    this.isAscending = !this.isAscending
    const msg = this.isAscending ? 'asc' : 'desc'
    this.emitter.publish('direction-channel', msg)
  }
}
