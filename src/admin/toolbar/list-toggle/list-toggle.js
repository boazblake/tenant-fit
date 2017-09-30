import { inject } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { EventAggregator } from 'aurelia-event-aggregator'

@inject(HttpClient, EventAggregator)
export class ListToggle {
  constructor(http, emitter) {
    this.isCard = true
    this.emitter = emitter
  }

  pub() {
    const msg = !this.isCard
    this.isCard = msg
    this.emitter.publish('store-isCard-channel', msg)
  }
}
