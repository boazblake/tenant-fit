import { inject, useView } from 'aurelia-framework'
import {PLATFORM} from 'aurelia-pal';
import {Router} from 'aurelia-router'
import { CheckAuth } from 'authConfig'


const routes =
  [ { route: [':admin/:id']
    , name: 'dashboard'
    , moduleId: PLATFORM.moduleName('./dashboard/dashboard')
    , nav: false
    , title: 'Dashboard'
    , settings: { roles: ['admin', 'auth'] }
    }
  , { route: ''
    , redirect: 'admin'
    }
  ]

@inject(Router)
export class Admin {
  constructor(router) {
    this.style = 'style'
  }

  configureRouter(config, router) {
    config.map(routes)

    config.mapUnknownRoutes(_ => PLATFORM.moduleName('../client/client'))

    this.router = router
  }

}

class AuthorizeStep {
  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.indexOf('admin') !== -1)) {
      if ( ! CheckAuth.isAdmin() ) return next.cancel(new Redirect('/'))
    }
    return next();
  }
}