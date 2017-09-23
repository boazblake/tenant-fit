// we want font-awesome to load as soon as possible to show the fa-spinner
import '../static/styles.css';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bulma/css/bulma.css'
import 'babel-polyfill';

import * as Bluebird from 'bluebird';

Bluebird.config({ warnings: { wForgottenReturn: false } });

export async function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()

    .feature(PLATFORM.moduleName('components/footer/index'))
    .feature(PLATFORM.moduleName('components/nav-bar/index'))
    .feature(PLATFORM.moduleName('components/modal/index'))
    .feature(PLATFORM.moduleName('components/notify/index'))

    .feature(PLATFORM.moduleName('utilities/index'))
    .feature(PLATFORM.moduleName('valueConverters/index'))

    .plugin(PLATFORM.moduleName('aurelia-dialog'))
    .plugin(PLATFORM.moduleName('aurelia-animator-css'))
    // .plugin(PLATFORM.moduleName('aurelia-html-import-template-loader'))

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.

  await aurelia.start();
  await aurelia.setRoot(PLATFORM.moduleName('app'));
}


// TODO : add expiration to sessions? find out