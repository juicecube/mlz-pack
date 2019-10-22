const Mocha = require('mocha');
const rimraf = require('rimraf');
const path = require('path');
const webpack = require('webpack');
const mocha = new Mocha({
  timeout: '10000ms'
})

process.chdir(path.join(__dirname, 'template-project'))

rimraf('./dist', () => {
  const pack = require('../../lib').default;
  pack.serve();
  // const builderOptions = require('../../lib/config').default.getBuildConfig()
  // const prodConfig = require('../../lib/builder').default.createProdConfig(builderOptions)
  // webpack(prodConfig, (err, stats) => {
  //   if (err) {
  //     console.error(err);
  //     process.exit(2);
  //   }
  //   console.log(stats.toString({
  //     colors: true,
  //     modules: false,
  //     children: false
  //   }));

    // console.log('Webpack build success, begin run test.');
    // mocha.addFile(path.join(__dirname, 'html-test.js'));
    // mocha.addFile(path.join(__dirname, 'js-test.js'));
    // mocha.run();
  // })
})