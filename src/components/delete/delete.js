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
  @bindable type

  constructor(ds, emitter) {
    this.ds = ds
    this.emitter = emitter
  }

  do() {
    this.isRemovable ? this.undelete() : this.delete()
  }

  delete() {
    console.log(this.deletable)
    this.msg = `ARE YOU SURE? \n WARNING \n On Submission, this will delete all data associated with ${this
      .deletable.name}`
    this.ds
      .open({
        viewModel: Dialog,
        model: {
          deletable: this.deletable,
          title: 'DELETE',
          body: this.msg,
          isRemovable: this.isRemovable
        }
      })
      .whenClosed(result => {
        if (result.wasCancelled) {
          this.emitter.publish(
            `delete-${this.type}-channel`,
            identity(this.isRemovable)
          )
        } else if (!result.wasCancelled) {
          this.isRemovable = !this.isRemovable
          console.log('delte is rmeoving ', this.type, this.isRemovable)
          this.emitter.publish(`delete-${this.type}-channel`, {
            isRemovable: this.isRemovable,
            deletable: this.deletable
          })
        }
      })
  }

  undelete() {
    this.isRemovable = false
    this.msg = ''
    this.emitter.publish(`delete-${this.type}-channel`, this.isRemovable)
  }
}
