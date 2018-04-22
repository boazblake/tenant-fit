import { inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { styles } from './styles.css'

@inject(EventAggregator)
export class MultiSelect {
  constructor(emitter) {
    this.multiSelect = false
    this.emitter = emitter
    this.isAvailable = false
    this.styles = styles
  }

  attached() {
    const handler = c => msg =>
      this.isAvailable = ! msg

    this.emitter.subscribe('store-isCard-channel', handler(this))
    handler(this)(true)
  }

  pub() {
    const msg = !this.multiSelect
    this.multiSelect = msg
    this.emitter.publish('multiSelect-channel', msg)
  }
}
