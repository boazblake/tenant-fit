import {PLATFORM} from 'aurelia-pal';
import { useView, inject } from 'aurelia-framework'
import {Router} from 'aurelia-router'

const routes =
  [ { route: ['tenantfit/:id']
    , name: 'tenants'
    , moduleId: PLATFORM.moduleName('../tenants/tenants')
    , nav: false
    , title: 'Tenants'
    , settings: { roles: ['auth'] }
    }
  , { route: 'tenant/:id/stores'
    , name: 'stores'
    , moduleId: PLATFORM.moduleName('../stores/stores')
    , nav: false
    , title: 'Stores'
    , settings: { roles: ['auth'] }
    }
  , { route: 'stores/:id'
    , name: 'store'
    , moduleId: PLATFORM.moduleName('../stores/store/store')
    , nav: false
    , title: 'Store'
    , settings: { roles: ['auth'] }
    }
  , { route: ['', 'stores/:id']
    , name: 'all-stores'
    , moduleId: PLATFORM.moduleName('../stores/stores')
    , nav: false
    , title: 'All Stores'
    , settings: { roles: ['auth'] }
    }
  // , { route: 'stores'
  //   , name: 'tenant.stores'
  //   , moduleId: 'stores/component'
  //   , nav: false
  //   , title: 'stores'
  //   , settings: { roles: ['auth'] }
  //   }
  // , { route: 'store/:id/edit'
  //   , name: 'store.edit'
  //   , href: 'store.edit'
  //   , moduleId: 'stores/store/component'
  //   , nav: false
  //   , title: 'edit'
  //   , settings: { roles: ['auth'] }
  //   }
  ]

@inject(Router)
@useView('./home.html')
export class Home {
  constructor(router) {
    this.style = 'style'
  }

  configureRouter(config, router) {
    config.map(routes)

    config.mapUnknownRoutes(_ => PLATFORM.moduleName('../tenants/tenants'))

    this.router = router
  }

}
