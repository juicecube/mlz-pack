const path = require('path');
const chalk = require('chalk');

process.chdir(path.join(__dirname, '../../ts-example'));
const rootPath = path.resolve(__dirname, '../../../');
const entryPath = path.resolve(__dirname, '../../ts-example/index.tsx');
const htmlPath = path.resolve(__dirname, '../../ts-example/index.html');
const { serve } = require(path.resolve(rootPath, 'src/webpack/index'));

const argv = process.argv.slice(2);
serve({
  isDev: true,
  entryPath: { index: entryPath },
  htmlPlugin: {
    template: htmlPath,
  },
  svgr: false,
  devServer: {
    open: false,
    port: 5001,
  },
  externals: {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
  },
}, (server) => {
  if (argv.find((el) => el === '-t')) {
    server.close();
  }
  console.log(chalk.green('Serve Passed!'));
});
