import * as toastr from 'toastr';
import { inject } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class Notify {
  constructor(emitter) {
    this.emitter = emitter;
    this.emitter.subscribe('notify-success', this.showSuccess);
    this.emitter.subscribe('notify-info', this.showInfo);
    this.emitter.subscribe('notify-warning', this.showWarning);
    this.emitter.subscribe('notify-error', this.showError);

    // Not sure why this is not working... if you figure it out, let me know.
    toastr.options = {
        positionClass: "toast-bottom-full-width",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
        preventDuplicates: true,
        closeButton: true,
        progressBar: true
    }
  }

  showSuccess(message) {
    toastr.success(message, null, {preventDuplicates: true, closeButton: true});
  }

  showInfo(message) {
    toastr.info(message, null, {preventDuplicates: true, closeButton: true});
  }

  showWarning(message) {
    toastr.warning(message, null, {preventDuplicates: true, closeButton: true});
  }

  showError(message) {
    toastr.error(message, null, {preventDuplicates: true, closeButton: true});
  }

}