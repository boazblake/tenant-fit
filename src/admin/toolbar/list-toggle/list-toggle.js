import { inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'

@inject(EventAggregator)
export class ListToggle {
  constructor(emitter) {
    this.isCard = true
    this.emitter = emitter
  }

  attached() {
      sessionStorage.setItem('isCard', true)
  }

  pub() {
    const msg = !this.isCard
    this.isCard = msg
    sessionStorage.setItem('isCard', msg)
    this.emitter.publish('isCard-channel', msg)
  }

}
