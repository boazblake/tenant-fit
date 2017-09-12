// we want font-awesome to load as soon as possible to show the fa-spinner
import "babel-polyfill";
import '../static/styles.css';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'babel-polyfill';
import 'material-design-lite/material';

import * as Bluebird from 'bluebird';

// remove out if you don't want a Promise polyfill (remove also from webpack.config.js)
Bluebird.config({ warnings: { wForgottenReturn: false } });

export async function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()

    .feature(PLATFORM.moduleName('components/footer/index'))
    .feature(PLATFORM.moduleName('components/nav-bar/index'))
    .feature(PLATFORM.moduleName('components/modal/index'))

    .feature(PLATFORM.moduleName('utilities/index'))
    .feature(PLATFORM.moduleName('valueConverters/index'))

    .plugin(PLATFORM.moduleName('aurelia-mdl-plugin'))
    .plugin(PLATFORM.moduleName('aurelia-dialog'))
    .plugin(PLATFORM.moduleName('aurelia-animator-css'))
    // .plugin(PLATFORM.moduleName('aurelia-html-import-template-loader'))

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.

  await aurelia.start();
  await aurelia.setRoot(PLATFORM.moduleName('app'));
}


// TODO : add expiration to sessions? find out