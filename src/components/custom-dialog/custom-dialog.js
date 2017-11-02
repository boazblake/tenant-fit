import { DialogController } from 'aurelia-dialog'
import { inject } from 'aurelia-framework'

@inject(DialogController)
export class CustomDialog {
  constructor(dialog) {
    this.dialog = dialog
  }

  activate(model) {
    this.model = model
  }
}
