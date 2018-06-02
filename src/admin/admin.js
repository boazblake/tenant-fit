import { PLATFORM } from 'aurelia-pal'

const routes = [
  {
    route: [':admin/:id'],
    name: 'dashboard',
    moduleId: PLATFORM.moduleName('./dashboard/dashboard'),
    nav: false,
    title: 'Dashboard',
    settings: { auth: true, roles: ['admin', 'auth'] }
  },
  {
    route: '',
    redirect: 'admin'
  }
]

export class Admin {
  constructor() {
    this.style = 'style'
  }

  configureRouter(config, router) {
    config.map(routes)
    config.mapUnknownRoutes(_ => PLATFORM.moduleName('../client/client'))

    this.router = router
  }
}
