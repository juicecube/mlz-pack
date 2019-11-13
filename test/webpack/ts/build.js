const path = require('path');
const chalk = require('chalk');

const rootPath = '../../../';
const entryPath = path.resolve(__dirname, '../../ts-example/index.tsx');
const htmlPath = path.resolve(__dirname, '../../ts-example/index.html');

const { build } = require(`${rootPath}src/webpack/index`);

console.log(chalk.green('Testing build in dev...'));
build({
  isDev: true,
  entryPath: { index: entryPath },
  htmlPlugin: {
    template: htmlPath,
  },
}, () => {
  console.log(chalk.green('Dev Passed!'));
  console.log(chalk.green('Testing build in production...'));
  build({
    isDev: false,
    entryPath: { index: entryPath },
    htmlPlugin: {
      template: htmlPath,
    },
  }, () => {
    console.log(chalk.green('Production Passed!'));
    console.log(chalk.green('Testing serve...'));
    require('./serve');
  });
});


