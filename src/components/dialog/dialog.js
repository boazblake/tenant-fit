import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)
export class Dialog {
   constructor(controller) {
      this.controller = controller;
      this.answer = null;

      controller.settings.centerHorizontalOnly = true;
   }

   activate(msg) {
      this.message = msg;
   }
}