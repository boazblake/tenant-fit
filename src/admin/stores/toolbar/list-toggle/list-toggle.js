import { inject } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { EventAggregator } from 'aurelia-event-aggregator'

@inject(HttpClient, EventAggregator)
export class ListToggle {
  constructor(http, emitter) {
    this.isList = true
    this.emitter = emitter
  }

  pub() {
    this.isList = !this.isList
    const msg = this.isList ? 'asc' : 'desd'
    this.emitter.publish('list-channel', msg)
  }
}
