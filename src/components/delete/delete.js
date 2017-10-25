import { bindable, inject } from 'aurelia-framework'
import { DialogService } from 'aurelia-dialog'
import { Dialog } from '../dialog/dialog'
import { identity } from 'ramda'

export class Delete {
  static inject = [DialogService];
@bindable action
@bindable isRemovable
@bindable user
  constructor(ds) {
    this.ds = ds
  }

  delete() {
    this.ds.open(
      { viewModel: Dialog
      , model: {title: 'DELETE',  body:`Are you sure? \n WARNING \n On Submission, this will delete all data associated with ${this.user.name}, isRemovable: ${this.isRemovable}`, data: this.isRemovable}
      })
      .whenClosed(result => {
        if (result.wasCancelled) {
          return identity(this.isRemovable)
        } else if (!result.wasCancelled) {
          return this.isRemovable = !this.isRemovable
        }
      })
  }
}