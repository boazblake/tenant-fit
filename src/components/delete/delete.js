import { bindable, inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator'
import { DialogService } from 'aurelia-dialog'
import { Dialog } from '../dialog/dialog'
import { identity } from 'ramda'
@inject(DialogService, EventAggregator)
export class Delete {
  static inject = [DialogService, EventAggregator]
  @bindable deletable
  @bindable isRemovable
  constructor(ds, emitter) {
    this.ds = ds
    this.emitter = emitter
  }

  attached() {
    this.reset()
  }

  do() {
    this.isRemovable ? this.undelete() : this.delete()
  }

  delete() {
    this.msg = `ARE YOU SURE? \n WARNING \n On Submission, this will delete all data associated with ${this
      .deletable.name}`
    this.ds
      .open({
        viewModel: Dialog,
        model: {
          title: 'DELETE',
          body: this.msg,
          isRemovable: this.isRemovable
        }
      })
      .whenClosed(result => {
        if (result.wasCancelled) {
          this.emitter.publish('delete-channel', identity(this.isRemovable))
        } else if (!result.wasCancelled) {
          this.isRemovable = !this.isRemovable
          this.emitter.publish('delete-channel', this.isRemovable)
        }
      })
  }

  undelete() {
    this.isRemovable = false
    this.msg = ''
    this.emitter.publish('delete-channel', this.isRemovable)
  }

  reset() {
    this.msg = ''
    this.deletable = {}
  }
}
