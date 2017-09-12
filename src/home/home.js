import {PLATFORM} from 'aurelia-pal';
import { useView, inject } from 'aurelia-framework'
import {Router} from 'aurelia-router'
import { CheckAuth } from 'authConfig'


const routes =
  [{ route: ['', 'tenantfit/dashboard/:id']
    , name: 'dashboard'
    , moduleId: PLATFORM.moduleName('./dashboard/dashboard')
    , nav: false
    , title: 'Dashboard'
    , settings: { roles: ['auth'] }
    }
  ]

@inject(Router)
@useView('./home.html')
export class Home {
  constructor(router) {
    this.style = 'style'
  }

  configureRouter(config, router) {
    config.map(routes)

    config.mapUnknownRoutes(_ => PLATFORM.moduleName('./dashboard/dashboard'))

    this.router = router
  }

}

class AuthorizeStep {
  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.indexOf('auth') !== -1)) {
      if (! CheckAuth.admin() ) {
        return next.cancel(new Redirect('/'))
      }
    }
    return next();
  }
}