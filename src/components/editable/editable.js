import { EventAggregator } from 'aurelia-event-aggregator'
import { bindable, inject } from 'aurelia-framework'

@inject(EventAggregator)
export class Editable {
  @bindable isDisabled
  @bindable isEditable

  constructor(emitter) {
    this.emitter = emitter
  }

  edit() {
    const msg = { isDisabled: !this.isDisabled, isEditable: !this.isEditable }
    this.emitter.publish('edit-channel', msg)
  }

  reset() {
    this.isDisabled = true
    this.isEditable = false
  }
}
