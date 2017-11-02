import { bindable, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { Dialog } from '../dialog/dialog'
import { identity } from 'ramda'
@inject(DialogService, EventAggregator)
export class Update {
  static inject = [DialogService, EventAggregator]
  @bindable editable
  @bindable isEditable
  constructor(ds, emitter) {
    this.ds = ds
    this.emitter = emitter
  }

  attached() {
    this.reset()
  }

  do() {
    this.isEditable ? this.unupdate() : this.update()
  }

  update() {
    this.msg = `ARE YOU SURE? \n WARNING \n On Submission, this will update ${this
      .editable.name}`
    this.ds
      .open({
        viewModel: Dialog,
        model: {
          title: 'UPDATE',
          body: this.msg,
          isEditable: this.isEditable
        }
      })
      .whenClosed(result => {
        if (result.wasCancelled) {
          this.emitter.publish('update-channel', identity(this.isEditable))
        } else if (!result.wasCancelled) {
          this.isEditable = !this.isEditable
          this.emitter.publish('update-channel', this.isEditable)
        }
      })
  }

  unupdate() {
    this.isEditable = false
    this.msg = ''
    this.emitter.publish('update-channel', this.isEditable)
  }

  reset() {
    this.msg = ''
    this.editable = {}
  }
}
