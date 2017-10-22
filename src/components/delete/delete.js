import { bindable, inject } from 'aurelia-framework'
import { DialogService } from 'aurelia-dialog'
import { dialog } from 'components'

@inject(DialogService)
export class Delete {
@bindable action = () => {}
@bindable msg
  constructor(ds) {
    this.ds = DialogService
  }

  do() {
    console.log(this.ds)
    this.ds.open(
      { viewModel: dialog
      , model: this.msg
      })
      .then(result => {
        if (result.wasCancelled) return
        this.action()
      })
  }
}