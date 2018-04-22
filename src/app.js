import { inject } from 'aurelia-framework'
import { Redirect, Router } from 'aurelia-router'
import { PLATFORM } from 'aurelia-pal'
import { CheckAuth } from 'authConfig'
import { Notify } from './components/notify/notify'
import { style } from './style.css'

const routes = [
  {
    route: ['', 'tenantfit'],
    name: 'tenantfit',
    moduleId: PLATFORM.moduleName('./login/login'),
    nav: false,
    title: 'TENANT FIT LOGIN',
    settings: { roles: [] }
  },
  {
    route: 'tenantfit/dashboard/:id',
    name: 'client',
    moduleId: PLATFORM.moduleName('./client/client'),
    nav: false,
    title: 'CLIENT',
    settings: { roles: ['auth'] }
  },
  {
    route: 'tenantfit/:id',
    name: 'admin',
    moduleId: PLATFORM.moduleName('./admin/admin'),
    nav: false,
    title: 'ADMIN',
    settings: { roles: ['auth', 'admin'] }
  }
]

class AuthorizeStep {
  run(navigationInstruction, next) {
    if (
      navigationInstruction
        .getAllInstructions()
        .some(i => i.config.settings.roles.indexOf('auth') !== -1)
    ) {
      // TODO: use Ramda js and include admin if needed
      if (!CheckAuth.auth()) {
        return next.cancel(new Redirect('/'))
      }
    }
    return next()
  }
}

@inject(Notify, Router)
export class App {
  constructor(notify, router) {
    this.notify = notify
    this.style = style
    this.router = router
  }

  configureRouter(config, router) {
    config.title = 'Tenant Fit'
    config.options.pushState = true
    config.addPipelineStep('authorize', AuthorizeStep)
    config.exportToRouter(router)
    config.map(routes)

    config.mapUnknownRoutes(() => PLATFORM.moduleName('./login/login'))

    this.router = router
  }
}
