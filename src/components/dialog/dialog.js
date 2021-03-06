import { inject } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'

@inject(DialogController)
export class Dialog {
  constructor(controller) {
    this.controller = controller
  }

  canActivate({ title, body, isActionable }) {
    this.title = title
    this.body = body
    this.isActionable = isActionable
  }
}
