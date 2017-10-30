import { DialogService } from 'aurelia-dialog'
import { EventAggregator } from 'aurelia-event-aggregator'
import { bindable, inject } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { Update } from 'components/update/update'
import { clone } from 'ramda'
import { loadTask } from './model'

@inject(DialogService, EventAggregator, HttpClient)
export class TenantSection {
  @bindable userId
  @bindable adminId

  constructor(ds, emitter, http) {
    this.ds = ds
    this.emitter = emitter
    this.http = http
    this.state = {}
    this.data = {}
  }

  attached() {
    this.emitter.publish('loading-channel', true)
    this.reset()
    this.load()
  }

  load() {
    const onSuccess = c => tenants => {
      c.data.tenants = tenants
      c.state.tenants = clone(c.data.tenants)
      c.emitter.publish('loading-channel', false)
    }

    const onError = c => error => {
      c.error = error
      console.error(error)
      this.emitter.publish('notify-error', error.response)
    }

    loadTask(this.http)(this.userId)(this.adminId).fork(
      onError(this),
      onSuccess(this)
    )
  }

  do(tenant) {
    this.ds
      .open({
        viewModel: Update,
        model: {
          title: `Update ${tenant} name`,
          body: this.tenantText
        }
      })
      .whenClosed(result => {
        if (result.wasCancelled) {
          this.emitter.publish('notify-info', `${tenant} has not been modified`)
        } else if (!result.wasCancelled) {
          console.log(this.tenant)
          this.emitter.publish(
            'notify-success',
            `${tenant} has been successfully modified`
          )
        }
      })
  }

  reset() {
    // setTimeout(() => {
    //   console.log('reset', this.tenantText.innerHTML)
    // })
    this.state = {}
    this.data = {}
  }
}
