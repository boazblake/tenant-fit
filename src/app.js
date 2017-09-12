import {PLATFORM} from 'aurelia-pal';
import {Redirect, NavigationInstruction, RouterConfiguration, Router, Next} from 'aurelia-router'
import { CheckAuth } from 'authConfig'

const routes =
  [ { route: 'tenantfit'
    , name: 'tenantfit'
    , moduleId: PLATFORM.moduleName('./landing/landing')
    , nav: false
    , title: 'TENANT FIT LOGIN'
    , settings: { roles: [] }
    }
  , { route: 'tenantfit/dashboard/:id'
    , name: 'home'
    , moduleId: PLATFORM.moduleName('./home/home')
    , nav: false
    , title:'CLIENT'
    , settings: { roles: ['auth'] }
    }
  , { route: ['tenantfit/:id/admin']
    , name: 'admin'
    , moduleId: PLATFORM.moduleName('./admin/admin')
    , nav: false
    , title: 'ADMIN'
    , settings: { roles: ['auth', 'admin'] }
    }
  , { route: ['']
    , nav: false
    , redirect: 'tenantfit'
    }
  ]


export class App {
  constructor() {
  }

  configureRouter(config, router) {
    config.title = 'Tenant Fit'
    config.pushState = true
    config.addPipelineStep('authorize', AuthorizeStep)
    config.exportToRouter(router)
    config.map(routes)

    config.mapUnknownRoutes(() => PLATFORM.moduleName('./home/home'))

    this.router = router
  }
}

class AuthorizeStep {
  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.indexOf('auth') !== -1)) { // TODO: use Ramda js and include admin if needed
      if (! CheckAuth.auth()) {
        return next.cancel(new Redirect('/'))
      }
    }
    return next();
  }
}