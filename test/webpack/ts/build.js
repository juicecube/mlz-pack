const path = require('path');
const chalk = require('chalk');

process.chdir(path.join(__dirname, '../../ts-example'));
const rootPath = path.resolve(__dirname, '../../../');
const entryPath = path.resolve(__dirname, '../../ts-example/index.tsx');
const htmlPath = path.resolve(__dirname, '../../ts-example/index.html');

const { build } = require(path.resolve(rootPath, 'src/webpack/index'));

console.log(chalk.green('Testing build in dev...'));
build({
  isDev: true,
  entryPath: { index: entryPath },
  htmlPlugin: {
    template: htmlPath,
  },
  // alias: {
  //   example: path.join(rootPath, 'test/ts-example'),
  // }
}, () => {
  console.log(chalk.green('Dev Passed!'));
  console.log(chalk.green('Testing build in production...'));
  build({
    isDev: false,
    entryPath: { index: entryPath },
    htmlPlugin: {
      template: htmlPath,
    },
    dropConsole: false,
    // alias: {
    //   example: path.join(rootPath, 'test/ts-example'),
    // }
  }, () => {
    console.log(chalk.green('Production Passed!'));
    console.log(chalk.green('Testing serve...'));
    // require('./serve');
  });
});


