import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)
export class Dialog {
   constructor(controller) {
      this.controller = controller;
    }
    
    canActivate({title, body, data}) {
      this.title = title
      this.body = body
      this.data = data
    }
    
    activate() {
      // controller.settings.centerHorizontalOnly = true;
      this.load()
   }

   load() {
   }

}