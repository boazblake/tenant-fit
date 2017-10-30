import { inject } from 'aurelia-framework'
import { DialogController } from 'aurelia-dialog'

@inject(DialogController)
export class Update {
  constructor(controller) {
    this.controller = controller
  }

  canActivate({ title, body }) {
    this.title = title
    this.bodyText = body
  }

  attached() {
    this.body = this.bodyText
  }
}
