import { inject } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { EventAggregator } from 'aurelia-event-aggregator'
import { clone } from 'ramda'

@inject(HttpClient, EventAggregator)
export class Search {
  constructor(http, emitter) {
    this.query = ''
    this.emitter = emitter
  }

  pub() {
    const msg = clone(this.query)
    this.emitter.publish('search-channel', msg)
  }
}
