import { bindable, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { Dialog } from '../dialog/dialog'

@inject(DialogService, EventAggregator)
export class Update {
  static inject = [DialogService, EventAggregator]
  @bindable editable
  @bindable isDisabled
  @bindable type

  constructor(ds, emitter) {
    this.ds = ds
    this.emitter = emitter
    this.isEditable = false
  }

  do() {
    this.edi
    this.update()
  }

  update() {
    this.msg = `ARE YOU SURE? \n WARNING \n On Submission, this will update ${
      this.editable.name
    }`
    this.ds
      .open({
        viewModel: Dialog,
        model: {
          title: 'UPDATE',
          editable: this.editable,
          body: this.msg
        }
      })
      .whenClosed(result => {
        if (result.wasCancelled) {
          this.emitter.publish(`update-${this.type}-channel`, {
            isDisabled: this.isDisabled,
            editable: this.editable
          })
        } else if (!result.wasCancelled) {
          this.emitter.publish(`update-${this.type}-channel`, {
            isDisabled: !this.isDisabled,
            editable: this.editable
          })
        }
      })
  }
}
