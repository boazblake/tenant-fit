import {PLATFORM} from 'aurelia-pal';
import {Redirect, NavigationInstruction, RouterConfiguration, Router, Next} from 'aurelia-router'
import { checkAuth } from 'authConfig'

const routes =
  [ { route: 'tenantfit'
    , name: 'tenantfit'
    , moduleId: PLATFORM.moduleName('./landing/landing')
    , nav: false
    , title: 'TENANT FIT LOGIN'
    , settings: { roles: [] }
    }
  , { route: 'tenantfit/:id'
    , name: 'home'
    , moduleId: PLATFORM.moduleName('./home/home')
    , nav: false
    , title:'home'
    , settings: { roles: ['auth'] }
    }
  , { route: ['']
    , nav: false
    , redirect: 'tenantfit'
    }
  ]


  export class App {
    constructor() {
      this.style = 'style'
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
      if (navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.indexOf('auth') !== -1)) {
        if (! checkAuth()) {
          return next.cancel(new Redirect('/'))
        }
      }
      return next();
    }
  }
