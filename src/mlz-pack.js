const program = require('commander');
const chalk = require('chalk');

const pkg = require('../package.json');
const Pack = require('./index');

program
  .version(`mlz-pack ${pkg.version}`)
  .usage('<command> [options]');

// build命令可指定入口文件，同时可配置环境变量和输出的文件夹
program
  .command('build [entry]')
  .description('build your project from a entry file(.js||.ts||.tsx), default: src/index.tsx')
  .option('-e, --env <environment>', 'dev or prod（default: prod）')
  .option('-d, --dest <dest>', 'output directory (default: build)')
  .action((entry, cmd) => {
    const config = {
      webpack: {
        entryPath: entry,
        buildPath: cmd.dest,
      },
    };
    Pack.build(cmd.env === 'dev' ? 'dev' : 'prod', config);
  });

// serve命令可起一个开发服务，可指定入口文件，同时可以配置端口号
program
  .command('serve [entry]')
  .description('serve your project in development mode')
  .option('-p, --port <port>', 'port used by the server (default: 8080)')
  .action((entry, cmd) => {
    process.env.NODE_ENV = 'development';
    const config = {
      webpack: {
        entryPath: entry,
        devServer: {
          port: cmd.port,
        },
      },
    };
    Pack.serve(config);
  });

// 导出webpack配置以便用户自定义webpack配置
program
  .command('eject')
  .description('eject webpack config.')
  .action(() => {
    Pack.eject();
  });

// 未知命令的提示
program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp();
    console.log(`  ${ chalk.red(`Unknown command ${chalk.yellow(cmd)}.`)}`);
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
