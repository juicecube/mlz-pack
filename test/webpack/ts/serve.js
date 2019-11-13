const path = require('path');
const chalk = require('chalk');

const rootPath = path.resolve(__dirname, '../../../');
const entryPath = path.resolve(__dirname, '../../ts-example/index.tsx');
const htmlPath = path.resolve(__dirname, '../../ts-example/index.html');
const { serve } = require(path.resolve(rootPath, 'src/webpack/index'));

serve({
  isDev: true,
  entryPath: { index: entryPath },
  htmlPlugin: {
    template: htmlPath,
  },
  devServer: {
    open: false,
  }
}, (server) => {
  server.close();
  console.log(chalk.green('Serve Passed!'));
});