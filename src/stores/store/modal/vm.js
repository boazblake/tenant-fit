import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@customElement('Vm')
@useView('./Vm.html')
@inject(DialogController)
export class Vm {
   constructor(controller) {
      this.controller = controller;
      this.answer = null;

      controller.settings.centerHorizontalOnly = true;
   }

   activate(message) {
      this.message = message;
   }
}
