import { EventAggregator } from 'aurelia-event-aggregator'
import { bindable, inject } from 'aurelia-framework'

@inject(EventAggregator)
export class EditForm {
  @bindable isDisabled
  @bindable isEditable

  constructor(emitter) {
    this.emitter = emitter
  }

  edit() {
    // this.isDisabled = !this.isDisabled
    // this.isEditable = !this.isEditable
    const msg = { isDisabled: !this.isDisabled, isEditable: !this.isEditable }
    this.emitter.publish('edit-form-channel', msg)
  }

  reset() {
    this.isDisabled = true
    this.isEditable = false
  }
}
