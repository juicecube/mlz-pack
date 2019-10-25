import program from 'commander';
import Init from './index';
import figlet from 'figlet';
import chalk from 'chalk';
const pkg = require('../package.json');

function printBanner () {
  figlet.text('mlz pack', {
    font: '3D-ASCII',
    horizontalLayout: 'default',
    verticalLayout: 'default',
  }, function(err, data) {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log(chalk.blue(data));
    console.log(chalk.blue(` mlz-pack 当前版本 ${pkg.version}`));
    console.log(chalk.blue(' Run mlz-pack to see usage.'));
  });
}

program
  .version(`mlz-pack ${pkg.version}`)
  .usage('<command> [options]');

program
  .command('build [env]')
  .description('build your project in dev/prod mode')
  .option('-e, --entry <entry>', 'entry file(.js||.ts||.tsx), default: src/index')
  .option('-d, --dest <dest>', 'output directory (default: build)')
  .action((env, cmd) => {
    if (env === 'dev') {
      Init.build('dev');
    } else {
      Init.build('prod');
    }
  });

program
  .command('serve [entry]')
  .description('serve your project in development mode')
  .option('-p, --port <port>', 'port used by the server (default: 8080)')
  .action((entry, cmd) => {
    Init.serve();
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
