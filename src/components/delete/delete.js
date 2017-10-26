import { bindable, inject } from 'aurelia-framework'
import { DialogService } from 'aurelia-dialog'
import { Dialog } from '../dialog/dialog'
import { identity } from 'ramda'

export class Delete {
  static inject = [DialogService];
@bindable deletable
@bindable isRemovable
  constructor(ds) {
    this.ds = ds
  }
  
  attached() {
    this.reset()
 }
  
  do() {
    this.isRemovable 
    ? this.undelete()
    : this.delete()
  }
  
  delete() {
    this.msg = `ARE YOU SURE? \n WARNING \n On Submission, this will delete all data associated with ${this.deletable.name}`
    this.ds.open(
      { viewModel: Dialog
      , model: {title: 'DELETE',  body:this.msg, isRemovable: this.isRemovable}
      })
      .whenClosed(result => {
        if (result.wasCancelled) {
          return identity(this.isRemovable)
        } else if (!result.wasCancelled) {
          return this.isRemovable = !this.isRemovable
        }
      })
  }

  undelete() {
    this.msg = ''
    return this.isRemovable = !this.isRemovable
  }

  reset() {
    this.msg= ''
    this.deletable= {}
  }
}